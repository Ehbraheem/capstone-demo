class ApplicationController < ActionController::API

  include DeviseTokenAuth::Concerns::SetUserByToken

  # make the connection between controller action and associated view
  include ActionController::ImplicitRender

  # Authorization gem
  include Pundit

  # hook in the devise whitelisting params[] method
  before_action :configure_permitted_parameters, if: :devise_controller?

  # intercept RecordNotFound/DocumentNotFound exception and return json error response
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
  rescue_from Mongoid::Errors::DocumentNotFound, with: :record_not_found

  rescue_from Mongoid::Errors::Validations, with: :mongoid_validation_error

  # intercept ActionController::ParameterMissing exception
  rescue_from ActionController::ParameterMissing, with: :params_missing

  # Pundit authorization error callback
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  protected
    def full_message_error full_message, status
      payload = {
          errors: { full_messages: ["#{full_message}"]}
      }
      render :json => payload, :status => status
    end

  def record_not_found exception
    full_message_error "cannot find id[#{params[:id]}]", :not_found
    Rails.logger.debug exception.message
  end

    # for devise permission of name field in the params[]
    def configure_permitted_parameters
      devise_parameter_sanitizer.permit(:sign_up, keys: [:name])
    end

    def params_missing exception
      payload = {
          errors: { full_messages: ["#{exception.message}"] }
      }
      render json: payload, status: :bad_request
      Rails.logger.debug exception.message
    end

    def user_not_authorized exception
      user = pundit_user ? pundit_user.uid : "Annonymous user"
      payload = {
          errors: {full_message: ["#{user} not authorized to #{exception.query}"]}
      }
      render :json => payload, :status => :forbidden
      Rails.logger.debug exception
    end

    def mongoid_validation_error exception
      payload = { errors: exception.record.errors.messages }
      render :json => payload, :status => :unprocessable_entity
      Rails.logger.debug exception.message
    end
end

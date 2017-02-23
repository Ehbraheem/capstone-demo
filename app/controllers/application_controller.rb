class ApplicationController < ActionController::API

  include DeviseTokenAuth::Concerns::SetUserByToken

  # make the connection between controller action and associated view
  include ActionController::ImplicitRender

  # hook in the devise whitelisting params[] method
  before_action :configure_permitted_parameters, if: :devise_controller?

  # intercept RecordNotFound/DocumentNotFound exception and return json error response
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
  rescue_from Mongoid::Errors::DocumentNotFound, with: :record_not_found

  # intercept ActionController::ParameterMissing exception
  rescue_from ActionController::ParameterMissing, with: :params_missing

  protected
    def record_not_found exception
      payload = {
          errors: { full_messages: ["cannot find id[#{params[:id]}]"]}
      }
      render :json => payload, :status => :not_found
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
end

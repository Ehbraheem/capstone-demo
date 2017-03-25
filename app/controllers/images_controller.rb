class ImagesController < ApplicationController
  before_action :set_image, only: [:show, :update, :destroy]
  wrap_parameters :image, include: ["caption"]
  before_action :authenticate_user!, only: [:create, :update, :destroy]
  after_action :verify_authorized
  after_action :verify_policy_scoped, only: [:index]

  # GET /images
  # GET /images.json
  def index
    authorize Image
    @images = policy_scope Image.all
    #
    # render json: @images
  end

  # GET /images/1
  # GET /images/1.json
  def show
    # render json: @image
  end

  # POST /images
  # POST /images.json
  def create
    authorize Image #, :create?
    # authorize :custom, :you_betcha?
    @image = Image.new(image_params)
    @image.creator_id = current_user.id

    if @image.save
      render :show, status: :created, location: @image
    else
      # render json: @image.errors, status: :unprocessable_entity
      render json: {errors:  @image.errors.messages,}, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /images/1
  # PATCH/PUT /images/1.json
  def update
    @image = Image.find(params[:id])

    if @image.update(image_params)
      head :no_content
    else
      # render json: @image.errors, status: :unprocessable_entity
      render json: {errors:  @image.errors.messages,}, status: :unprocessable_entity
    end
  end

  # DELETE /images/1
  # DELETE /images/1.json
  def destroy
    @image.destroy

    head :no_content
  end

  private

    def set_image
      @image = Image.find(params[:id])
    end

    def image_params
      params.require(:image).permit(:caption)
    end
end

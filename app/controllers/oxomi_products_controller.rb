class OxomiProductsController < ApplicationController
    def create
        puts params[:product]
        puts params[:product][:name]
        respond_to do |format|
            if product_exists?(params[:product][:name])
                @product = Spree::Product.where(name: params[:product][:name]).first
                format.json { render json: {status: "success", id: @product.id}, status: :created }
            else
                @product = Spree::Product.new(name: params[:product][:name], description: params[:product][:description], price: params[:product][:price], slug: params[:product][:name].downcase.gsub(".", "-"), tax_category_id: 1, shipping_category_id: 1)
                if @product.save
                    format.json { render json: {status: "success", id: @product.id}, status: :created }
                    # I need to add it to order with state: "cart"
                else
                    puts @product.errors
                    format.json { render json: {status: "failed"}, status: :unprocessable_entity}
                end
            end
        end
        # after saving the product we need to check and added to cart
    end

    private

    def product_exists?(name)
        Spree::Product.where(name: name).first.present?
    end
end

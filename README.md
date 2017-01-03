# Example React upload progress bar with Rails 5 API
## Content
- Create simple RAILS 5 API
- Create React APP use create-react-app

## Create simple Rails 5 API
Setup new rails 5 project:
```
rails _5.0.1_ new media_api -d postgresql
```

Edit Gemfile:
```
# ...
gem 'rack-cors', '0.4.0'
gem 'paperclip', '5.0.0.beta2'
gem 'bootstrap', '~> 4.0.0.alpha5'
# ...
```

Edit `config/database.yml`:
```
default: &default
  adapter: postgresql
  encoding: unicode
  pool: <%= ENV.fetch("RAILS_MAX_THREADS") { 5 } %>
  template: template0
  host: localhost
  username: postgres
  password: [password to access PG]
```

Install the gems:
```
bundle install
```

Go to the application configuration file and add the configurations for CORS:
```ruby

```

Generate model view controller `Item`:
```
rails g scaffold Item name:string description:string
```

Generate a migration that will add the attachment to the database use `paperclip`:
```
rails g paperclip item picture
```

Create the database if not exists:
```
rails db:create
```

Migrate the database:
```
rails db:migrate
```

Result:
```
== 20170103114249 CreateItems: migrating ======================================
-- create_table(:items)
   -> 0.0149s
== 20170103114249 CreateItems: migrated (0.0149s) =============================

== 20170103114304 AddAttachmentPictureToItems: migrating ======================
-- change_table(:items, {})
   -> 0.0020s
== 20170103114304 AddAttachmentPictureToItems: migrated (0.0021s) =============
```

Add the following lines in the file of the model `Item`:
```ruby
has_attached_file :picture, styles: { medium: "300x300>", thumb: "100x100>" }, default_url: "/images/:style/missing.png",
                    url: "/media/:id/:style/:hash.:extension",
                    path: ":rails_root/public/media/:id/:style/:hash.:extension",
                    hash_secret: "tamtam"

validates_attachment :picture, presence: true
do_not_validate_attachment_file_type :picture
```

Add controller upload in `app/controller/items_controller.rb`:
```ruby
def upload
  data = {
    name: params[:name],
    description: params[:description],
    picture: params[:picture]
  }
  item = Item.new(data)
  if item.save
    render json: {
      item: {
        name: item.name,
        description: item.description,
        picture_url: item.picture.url
      },
      status: 200
    }
  else
    render json: { message: "Something went wrong.", status: 400 }
  end
end
```

Add a permitted parameter that is going to accept `:picture`:
```ruby
def item_params
  params.require(:item).permit(:name, :description, :picture)
end
```

Add routes `/upload` in `config/routes.rb`:
```ruby
Rails.application.routes.draw do
  resources :items
  post '/upload' => 'items#upload'
end
```

Rename `application.css` to `application.scss` in `app/assets/stylesheets` and add this line:
```
@import "bootstrap";
```

Add this line to `app/assets/javascripts/application.js`:
```
//= require jquery
//= require jquery_ujs
//= require bootstrap-sprockets
//= require turbolinks
//= require_tree .
```

Update `app/views/layouts/application.html.erb`:
```html
<!DOCTYPE html>
<html>
  <head>
    <title>DemoUpload1</title>
    <%= csrf_meta_tags %>

    <%= stylesheet_link_tag    'application', media: 'all', 'data-turbolinks-track': 'reload' %>
    <%= javascript_include_tag 'application', 'data-turbolinks-track': 'reload' %>
  </head>

  <body>
     <div class="container">
      <div class="row">
        <%= yield %>
      </div>
    </div>
  </body>
</html>

```

## Create React App use `create-react-app`

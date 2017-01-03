# Example React upload progress bar with Rails 5 API
## Content
- Create simple Rails 5 API
- Create React app use create-react-app

## Screenshot
![Example React upload progress bar with Rails 5 API](https://raw.githubusercontent.com/ntamvl/react-upload-progress-bar-with-rails-5-api/master/screenshot.png)

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

Add `:verify_authenticity_token` to `application_controller.rb`:
```ruby
class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  skip_before_action :verify_authenticity_token
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

Run Rails 5 API app on port `3003`:
```
rails s -b 0.0.0.0 -p 3003
```

## Create React App use `create-react-app`
To install `create-react-app`, please read at https://facebook.github.io/react/blog/2016/07/22/create-apps-with-no-configuration.html

Create simple React App:
```
create-react-app media_client
```

Install packages:
```
npm i react-dropzone react-redux redux redux-form axios rc-progress node-uuid bootstrap jquery --save
```

Add jquery and bootstrap to `index.js`:
```
import 'bootstrap/dist/css/bootstrap.css';
import jquery from 'jquery';
window.$ = window.jQuery=jquery;
require('bootstrap/dist/js/bootstrap');
```

Add Upload components in `src/components`:
```javascript
import React, { Component } from 'react';
import Dropzone from 'react-dropzone';
import { Field, reduxForm } from 'redux-form';
import { post } from 'axios';
import { Line, Circle } from 'rc-progress';
import { v4 } from 'node-uuid';

class Upload extends Component {
  constructor(props) {
    super(props);
    this.onDrop = this.onDrop.bind(this);
    this.onOpenClick = this.onOpenClick.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.state = {
      files: [],
      percentCompleted: 0
    }
  }

  onFormSubmit(data) {
    const url = '/upload';
    let formData = new FormData();
    formData.append('name', data.name)
    formData.append('description', data.description)
    formData.append('picture', data.picture)
    console.log("formData", formData);
    const config = {
        headers: { 'content-type': 'multipart/form-data' },
        onUploadProgress: function(progressEvent) {
          var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
          this.setState({ percentCompleted: percentCompleted });
        }.bind(this)
    }

    post(url, formData, config)
        .then(function(response) {
            console.log(response);
        })
        .catch(function(error) {
            console.log(error);
        });
  }

  onDrop(acceptedFiles) {
    this.setState({
      files: acceptedFiles
    });
    console.log("onDrop", this.state.files);

    acceptedFiles.forEach((file)=> {
      const data = {
        name: "dora1",
        description: "dora1 description",
        picture: file
      }
      console.log("file", JSON.stringify(data));

      this.onFormSubmit(data);
    });

  }

  onOpenClick() {
    this.dropzone.open();
    console.log("onOpenClick", this.state.files);
  }

  renderThumb(file, idx) {
    return (
      <div className="col-md-2" key={ v4() }>
        <img key={ v4() } src={file.preview} className="img-thumbnail" />
      </div>
    )
  }

  render() {
    const progress = this.state.percentCompleted;
    return (
      <div className="col-md-12">
        <div className="row">
          <Dropzone ref={(node) => { this.dropzone = node; }} onDrop={this.onDrop}>
              <div>Try dropping some files here, or click to select files to upload.</div>
          </Dropzone>
          <div className="pull-left">
            <br />
            <button type="button" className="btn" onClick={this.onOpenClick}>
              Open files
            </button>
          </div>
        </div>
        <div className="row">
          <p>{progress} %</p>
          <Line percent={progress} strokeWidth="4" strokeColor="#00ff00" />
          {/* <Circle percent={progress} strokeWidth="4" strokeColor="#D3D3D3" /> */}
        </div>

        {this.state.files.length > 0 ? <div>
        <h2>Uploading {this.state.files.length} files...</h2>
        <div className="row">
          {this.state.files.map((file, idx) => this.renderThumb(file, idx) )}
        </div>
        </div> : null}
      </div>
    )
  }
}

export default Upload
```

Add proxy in `package.json` point to rails api:
```
"proxy": "http://localhost:3003",
```

Run React app:
```
yarn start
```

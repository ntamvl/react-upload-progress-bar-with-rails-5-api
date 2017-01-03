Rails.application.routes.draw do
  resources :items
  post '/upload' => 'items#upload'
end

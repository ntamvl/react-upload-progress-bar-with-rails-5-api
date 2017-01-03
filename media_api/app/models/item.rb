class Item < ApplicationRecord
  has_attached_file :picture, styles: { medium: "300x300>", thumb: "100x100>" }, default_url: "/images/:style/missing.png",
                    url: "/media/:id/:style/:hash.:extension",
                    path: ":rails_root/public/media/:id/:style/:hash.:extension",
                    hash_secret: "tamtam"

  validates_attachment :picture, presence: true
  do_not_validate_attachment_file_type :picture
end

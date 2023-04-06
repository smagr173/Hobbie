class Contact < ActiveRecord::Base
  FLAGS = {
    DISABLED: 1
  }

  class ImportContext
    attr_reader :book_type

    def initialize(args)
      @book_type = args.fetch(:type, 'Contact')
    end
  end

  include ImportsLibraryItems
  has_columns_for_library_item_import :address, { name: :address_2, required: false }, :city, { name: :name, required: false }, :phone, :state, :zip_code

  scope :disabled, -> { where('flags & 1 = 1') }
  scope :enabled, -> { where('flags & 1 = 0') }
  
  class << self
    def do_import(row, company, context)
      company.contacts.create!({
        address: row['address'],
        address_2: row['address_2'],
        city: row['city'],
        name: row['name'] || '',
        phone: row['phone'],
        state: row['state'],
        zip_code: row['zip_code']
      })
    end
    
    def inherited(child)
      super
      child.instance_eval do
        def model_name
          Contact.model_name
        end
      end
    end
    
  end
  
  def disabled?
    FLAGS[:DISABLED] == FLAGS[:DISABLED] & self.flags
  end
  
  def enabled?
    0 == FLAGS[:DISABLED] & self.flags
  end
  
end

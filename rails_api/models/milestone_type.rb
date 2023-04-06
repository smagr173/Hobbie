class MilestoneType < ActiveRecord::Base
  include IsNotAudited

  has_many :milestones
end

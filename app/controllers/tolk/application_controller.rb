class Tolk::ApplicationController < ApplicationController
  include Tolk::Pagination::Methods

  helper :all
  protect_from_forgery

  cattr_accessor :authenticator
  before_filter :authenticate

  def authenticate
#      self.authenticator.bind(self).call if self.authenticator && self.authenticator.respond_to?(:call)
    instance_exec(nil, &self.authenticator) if self.authenticator && self.authenticator.respond_to?(:instance_exec)
  end

  def ensure_no_primary_locale
    redirect_to tolk.locales_path if @locale.primary?
  end

  def method_missing(method, *args, &block)
    if (method.to_s.end_with?('_path') || method.to_s.end_with?('_url')) && main_app.respond_to?(method)
      main_app.send(method, *args)
    else
      super
    end
  end
end

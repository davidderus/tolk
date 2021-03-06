# Tolk
[![Build Status](https://travis-ci.org/tolk/tolk.svg?branch=master)](https://travis-ci.org/tolk/tolk)

Tolk is a Rails engine designed to facilitate the translators doing the dirty work of translating your application to other languages.

## Disclaimer

This is a forked version of Tolk, with numerous changes:
- No engine layout, Tolk use the Rails project one's (switching from isolated engine to semi-isolated one)
- Path handling, no need to override Tolk's templates to prefix paths with *main_app*
- Bootstrap support, as all of our projects use it
- i18n enabled

## TODO
- Keep it DRY! (not the case in original version too)

## Requirements

Tolk is compatible with Rails 4.0, 4.1, and 4.2.

## Installation & Setup

To install add the following to your Gemfile:

```ruby
  gem 'tolk', git: 'git@gitlab:dderus/tolk.git', branch: :master
```

Also add either [`kaminari`](https://github.com/amatsuda/kaminari) or [`will_paginate`](https://github.com/mislav/will_paginate):

```ruby
gem 'kaminari'
# OR
gem 'will_paginate'
```

To setup just run:

```bash
  $ rake tolk:setup
```

and follow the guide !

## Usage

### Setup and import

Tolk treats `I18n.default_locale` as the master source of strings to be translated. If you want the master source to be different from `I18n.default_locale`, you can override it by setting `Tolk::Locale.primary_locale_name`. Developers are expected to make all the changes to the master locale file ( en.yml by default ) and treat all the other locale.yml files as readonly files.

As tolk stores all the keys and translated strings in the database, you need to ask Tolk to update it's database from the primary yml file :

```bash
  $ rake tolk:sync
```

The above will fetch all the new keys from en.yml and put them in the database. Additionally, it'll also get rid of the deleted keys from the database and reflect updated translations - if any.

If you already have data in your non primary locale files, you will need to import those to Tolk as a one time thing :

```bash
  $ rake tolk:import
```

Upon visiting http://your_app.com/tolk - you will be presented with different options like creating new locale or providing translations for the existing locales.


### Saving locales to files


Once done with translating all the pending strings, you are can write back the new locales to filesystem. You have two options when dumping database locale data to file:


```bash
  # With Bash
  $ rake tolk:dump_yaml[the_target_locale]

  # With Zsh
  $ rake 'tolk:dump_yaml[the_target_locale]'
```

This command will generate a single yml file for a specified locale. The locale ISO code should be given in string format as the only argument ("en-us" or "en-gb" for example).


```bash
  $ rake tolk:dump_all
```

This will generate yml files for all non primary locales and put them in `#{Rails.root}/config/locales/` directory by default.

You can use the dump_all method defined in `Tolk::Locale` directly and pass directory path as the argument if you want the generated files to be at a different location :

```bash
  $ script/runner "Tolk::Locale.dump_all('/Users/lifo')"
```

You can even download the yml file using Tolk web interface by appending `.yaml` to the locale url. E.g `http://your_app.com/tolk/locales/de.yaml`

### Translation statistics

You can ask statistics about missing or updated translations to be tracked for third party tools in `http://your_app.com/tolk/stats.json` endpoint.

```json
{
  "ar":
    {
      "missing":2928,
      "updated":17,
      "updated_at":"2013-03-04T12:44:03Z"
    }
  ,"ca":
    {
      "missing":1377,
      "updated":1,
      "updated_at":"2013-03-04T13:06:46Z"
    }
  ,"fr":
    {
      "missing":735,
      "updated":5,
      "updated_at":"2013-03-04T13:15:51Z"
    }
}
```

## Authentication

If you want to authenticate users who can access Tolk, you need to provide <tt>Tolk::ApplicationController.authenticator</tt> proc. For example :

```ruby
  # config/initializers/tolk.rb
  Tolk::ApplicationController.authenticator = proc {
    authenticate_or_request_with_http_basic do |user_name, password|
      user_name == 'translator' && password == 'transpass'
    end
  }
```

Authenticator proc will be run from a before filter in controller context.

Or to use with Devise and some RBAC:

```ruby
  # config/initializers/tolk.rb
  Tolk::ApplicationController.authenticator = proc {
    unless current_user && current_user.is_admin?
      redirect_to main_app.new_user_session_path
    end
  }
```

## Handling blank and non-string values

Tolk speaks YAML for non strings values. If you want to enter a nil values, you could just enter '~'. Similarly, for an Array value, you could enter :

```yml
  ---
  - Sun
  - Mon
```

And Tolk will take care of generating the appropriate entry in the YAML file.

## i18n

By default, Tolk came with an english translation.
To create other translations, create a new locale file in your main application, like:

```yml
  # config/locales/tolk.fr.yml
  fr:
  tolk:
    search_form:
      search: 'Rechercher pour'
      phrase: 'la phrase'
      within_key: 'dans la clé'
      submit: 'Valider'
```

Don't forget to restart your Rails server right after creating the yml.

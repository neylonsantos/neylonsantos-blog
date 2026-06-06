module Jekyll
  module BrazilianPortugueseDateFilter
    MONTHS_PTBR = [
      nil,
      "janeiro", "fevereiro", "março", "abril", "maio", "junho",
      "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
    ]

    DAYS_OF_WEEK_PTBR = [
      "domingo", "segunda-feira", "terça-feira", "quarta-feira",
      "quinta-feira", "sexta-feira", "sábado"
    ]

    # 06 de junho de 2026
    def ptbr_date(input)
      return input if input.nil?
      date = time(input)
      day = date.strftime("%d")
      month = MONTHS_PTBR[date.month]
      year = date.strftime("%Y")

      "#{day} de #{month} de #{year}"
    end

    # Segunda-feira, 06 de junho de 2026
    def ptbr_date_complete(input)
      return input if input.nil?
      date = time(input)
      weekday = DAYS_OF_WEEK_PTBR[date.wday]
      day = date.strftime("%d")
      month = MONTHS_PTBR[date.month]
      year = date.strftime("%Y")

      "#{weekday.capitalize}, #{day} de #{month} de #{year}"
    end

    # Segunda-feira
    def ptbr_day_of_week(input)
      return input if input.nil?
      date = time(input)
      DAYS_OF_WEEK_PTBR[date.wday.capitalize]
    end
  end
end

Liquid::Template.register_filter(Jekyll::BrazilianPortugueseDateFilter)

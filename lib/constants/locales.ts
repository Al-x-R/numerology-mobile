// constants/locales.ts
export type Locale = 'ru' | 'en';

type TranslationValue = string | ((...args: any[]) => string);

type TranslationNode = TranslationValue | Translations | any[] | Record<string, any>;

interface Translations {
  [key: string]: TranslationNode;
}

interface LocaleData {
  [lang: string]: Translations;
}

const translations: LocaleData = {
  ru: {
    title: 'Код Даты',

    onboarding: {
      subtitle: 'Узнайте свою матрицу судьбы\nи раскройте потенциал',
      guestButton: 'Продолжить как гость',
      loginButton: 'У меня уже есть аккаунт',
      legal: 'Нажимая «Продолжить», вы соглашаетесь\nс условиями использования',
    },

    subtitle: 'Рассчитайте свой Квадрат Пифагора',
    inputPlaceholder: 'Введите дату рождения (ДД.ММ.ГГГГ)',
    buttonText: 'Рассчитать',
    loadingText: 'Расчёт...',

    tabs: {
      pythagoras: 'Психоматрица',
      compatibility: 'Совместимость',
      numbers: 'Числа'
    },

    back: 'Назад',
    pythagorasTitle: 'Психоматрица',
    analysisTitle: 'Анализ Даты',

    errorEmpty: 'Введите дату',
    errorFormat: 'Формат: ДД.ММ.ГГГГ',
    errorInvalid: 'Некорректная дата',

    compatibilityTitle: 'Совместимость',
    numbersTitle: 'Числа',
    changeLanguage: 'Сменить язык!',

    // TOOLTIPS
    tooltip_weak_character: 'Слабый характер',
    tooltip_strong_character: 'Сильный лидер',
    tooltip_weak_energy: 'Нет энергии',
    tooltip_strong_energy: 'Мощная энергия',
    tooltip_weak_health: 'Слабое здоровье',
    tooltip_weak_logic: 'Слабая логика',
    tooltip_weak_laziness: 'Лень',
    tooltip_weak_responsibility: 'Беспечность',
    tooltip_weak_memory: 'Плохая память',
    tooltip_develop: 'Развивать!',
    tooltip_superpower: 'Суперсила!',
    tooltip_genius: 'Гений!',
    tooltip_godlike: 'Божественно!',
    tooltip_strong_creativity: 'Творчество',
    tooltip_strong_logic: 'Сильная логика',
    tooltip_strong_temperament: 'Темперамент',
    tooltip_strong_luck: 'Удача',
    tooltip_strong_responsibility: 'Ответственность',
    tooltip_strong_memory: 'Память',

    // ADDITIONAL NUMBERS
    working1_title: '1-е Рабочее Число',
    working1_desc: 'Это "сырой" жизненный потенциал.',
    working2_title: '2-е Рабочее Число',
    working2_desc: 'Это ваша главная жизненная задача и миссия.',
    working3_title: '3-е Рабочее Число',
    working3_desc: 'Это "кармическая поправка" — то, что нужно отработать.',
    working4_title: '4-е Рабочее Число',
    working4_desc: 'Это "ключ" к решению кармических задач.',
    destiny_title: 'Число Судьбы',
    destiny_desc: 'Это ваша путеводная звезда.',

    // === ЯЧЕЙКИ ===
    cell_1_title: 'Характер',
    cell_2_title: 'Энергия',
    cell_3_title: 'Интерес',
    cell_4_title: 'Здоровье',
    cell_5_title: 'Логика',
    cell_6_title: 'Труд',
    cell_7_title: 'Удача',
    cell_8_title: 'Долг',
    cell_9_title: 'Память',

    // === 1 — ХАРАКТЕР ===
    '1_empty': 'У человека нет "единиц", что указывает на мягкий, податливый характер. Ему сложно принимать решения, он часто ищет поддержку у других. Может быть ведомым.',
    '1_1': 'Эгоистичный, слабовольный характер. Человек сосредоточен на себе, но ему не хватает "стержня" для достижения больших целей в одиночку.',
    '1_11': 'Золотая середина. Характер мягкий, но не бесхребетный. Человек умеет находить компромиссы, дипломатичен, хвалит других, но и о себе не забывает.',
    '1_111': 'Сильный, волевой характер. "Стержень". Человек способен вести за собой, принимать решения. В споре его сложно переубедить. Уравновешен.',
    '1_1111': 'Очень сильный, "золотой" характер. Волевой, целеустремленный. Однако может проявлять излишнюю жесткость и прямолинейность.',
    '1_11111': 'Диктатор. Характер очень жесткий, властный. Человек не терпит возражений, стремится к абсолютной власти. Переубедить невозможно.',
    '1_111111': 'Перегрузка. Характер деспотичный, часто неуживчивый. Человеку тяжело с самим собой. Возможны "взрывы" или уход в себя.',

    // === 2 — ЭНЕРГИЯ ===
    '2_empty': 'Энергии нет. "Энергетический вампир" (часто неосознанно). Человек быстро устает, нуждается в подпитке от других, любит скопления людей. Ему нужен активный отдых.',
    '2_2': 'Энергии мало. Человек — "донор", но отдает понемногу. Склонен к лени, метеочувствителен. Нуждается в спорте и свежем воздухе для восполнения.',
    '2_22': 'Нормальный уровень энергии. Человек может делиться энергией, хороший донор. Активен, жизнерадостен. Энергии хватает и на семью, и на работу.',
    '2_222': 'Знак экстрасенса. Очень сильная энергия. Человек может "лечить" руками или словом. Ему нужно обязательно "сбрасывать" излишек энергии (спорт, хобби), иначе возможны конфликты.',
    '2_2222': 'Сверхсильная энергия. "Донор" для всех. Люди тянутся к нему, чтобы "подзарядиться". Важно не растратить себя и научиться восполнять ресурс.',
    '2_22222': 'Переизбыток энергии. Человек может быть гиперактивным, неугомонным. Риск выгорания. Нужно направлять энергию в созидание.',
    '2_222222': 'Энергетическая перегрузка. Человек может быть неуправляемым, агрессивным. Нужна строгая самодисциплина и медитация.',

    // === 3 — ИНТЕРЕС ===
    '3_empty': 'Нет "троек". Человек — "технарь". Ему сложно даются гуманитарные науки. Очень чистюля, склонен к "синдрому отличника", придирчив к мелочам.',
    '3_3': 'Есть склонность к наукам, но она проявляется волнами. Сегодня — гуманитарий, завтра — технарь. Все зависит от настроения.',
    '3_33': 'Ярко выраженная способность к точным наукам (физика, математика). Человек — "технарь" до мозга костей. Логик.',
    '3_333': 'Очень сильный интерес к наукам. Потенциал великого ученого. Если не реализовать этот потенциал, "тройки" могут уйти в критиканство и бесконечную "скупость" на все.',
    '3_3333': 'Гениальность в науках. Человек может открыть новое. Но риск уйти в теорию и оторваться от реальности.',
    '3_33333': 'Сверхгениальность. Человек видит мир как систему. Может быть непонятым современниками.',
    '3_333333': 'Перегрузка. Человек может быть оторван от жизни, жить в мире идей. Риск психических расстройств.',

    // === 4 — ЗДОРОВЬЕ ===
    '4_empty': 'Здоровье от природы очень слабое. Человек "болеет" с детства. Ему нужно постоянно заниматься укреплением организма, закаливанием, спортом.',
    '4_4': 'Здоровье есть, но оно не "богатырское". Нужно беречь себя, особенно после 40-50 лет. Серьезные заболевания маловероятны, но хронические — возможны.',
    '4_44': 'Крепкое здоровье от природы. "Богатырское". Человек имеет высокий болевой порог, вынослив. Может профессионально заниматься спортом.',
    '4_444': 'Сверхкрепкое здоровье. Очень сильный иммунитет. Человек практически не болеет. Огромный запас физических сил.',
    '4_4444': 'Непробиваемое здоровье. Человек может пережить любые нагрузки. Регенерация на высшем уровне.',
    '4_44444': 'Сверхчеловеческая выносливость. Человек может жить в экстремальных условиях. Риск не чувствовать усталость.',
    '4_444444': 'Перегрузка. Организм может "взбунтоваться" от переизбытка сил. Риск травм из-за неосторожности.',

    // === 5 — ЛОГИКА ===
    '5_empty': 'Логики и интуиции нет. Человек "строит воздушные замки", живет в мире иллюзий. Ему сложно планировать. Все решения принимает "сердцем", часто ошибаясь.',
    '5_5': 'Логика есть. Человек способен анализировать, но интуиция развита слабо. Чаще полагается на факты, чем на "шестое чувство".',
    '5_55': 'Очень сильная интуиция. "Шестое чувство" работает идеально. Человек "видит" вещие сны, может предсказывать события. Ему не нужно объяснять — он "просто знает".',
    '5_555': 'Ясновидящий. Интуиция на грани сверхспособностей. Всегда знает, что сказать и что сделать. Обмануть его невозможно.',
    '5_5555': 'Перегрузка. Очень сильная интуиция, которая мешает жить. Человек видит и чувствует слишком много, от чего страдает. Часто замкнут.',
    '5_55555': 'Абсолютное ясновидение. Человек может видеть прошлое и будущее. Риск потери связи с реальностью.',
    '5_555555': 'Перегрузка. Человек может быть "вне этого мира". Риск психических расстройств или ухода в мистику.',

    // === 6 — ТРУД ===
    '6_empty': '"Не заземлен". Человек не любит физический труд, предпочитает умственную работу. Ему нужно научиться работать руками (хобби), чтобы "заземлиться".',
    '6_6': 'Человек "золотые руки". Может и любит работать физически, но только по настроению. Если заставлять — будет сопротивляться.',
    '6_66': 'Мастер "золотые руки". Обожает физический труд, все в доме делает сам. Для него лучший отдых — это работа на даче или в гараже.',
    '6_666': 'Знак "зверя" или "темперамента". Человек очень привлекателен для противоположного пола. Но в то же время очень конфликтен. Если не "сбрасывать" энергию в труд, становится невыносимым.',
    '6_6666': 'Человек — "рабочая лошадка". Готов трудиться 24/7, но часто в ущерб себе и семье. Не видит ничего, кроме работы.',
    '6_66666': 'Сверхтрудоголик. Может работать до изнеможения. Риск выгорания и проблем со здоровьем.',
    '6_666666': 'Перегрузка. Человек может стать "рабом труда". Риск потери семьи, здоровья, смысла жизни.',

    // === 7 — УДАЧА ===
    '7_empty': 'Удачи нет. Человек должен всего добиваться сам, своим трудом и умом. "Халява" исключена. Ему не везет в лотереях. Нужно развивать талант.',
    '7_7': 'Удача есть, но ее мало. "Везет" по мелочам. Чтобы добиться успеха, нужно приложить много усилий.',
    '7_77': '"Везунчик". Знак ангельской удачи. Человеку часто везет в жизни. Он "выходит сухим из воды" в сложных ситуациях. Ему нужно рисковать.',
    '7_777': 'Очень сильная удача. Человек может "управлять" своей удачей. Но это и большая ответственность — если он начнет использовать удачу во зло, она может отвернуться.',
    '7_7777': 'Абсолютная удача. Человек "золотой ребенок судьбы". Все получается само собой. Но риск зазнайства.',
    '7_77777': 'Космическая удача. Человек может менять судьбы. Риск гордыни и потери связи с реальностью.',
    '7_777777': 'Перегрузка. Удача может "сгореть". Риск трагедий, чтобы "сбросить" карму.',

    // === 8 — ДОЛГ ===
    '8_empty': 'Чувство долга отсутствует. "Все мне должны". Человек живет для себя, не заботясь о других. Эгоист. Ему нужно учиться ответственности.',
    '8_8': 'Развитое чувство долга. Ответственный, честный, порядочный. Но может забывать о своих интересах, помогая другим.',
    '8_88': 'Очень сильное чувство долга. "Гиперответственность". Человек готов пожертвовать всем ради блага семьи, друзей. Часто "везет" на себе всех.',
    '8_888': 'Знак "правдоруба". Человек с абсолютным чувством долга и справедливости. Служит народу, правде. Может быть политиком, судьей.',
    '8_8888': 'Святой долг. Человек живет ради других. Может стать духовным лидером. Риск истощения.',
    '8_88888': 'Абсолютная жертвенность. Человек может отдать жизнь за идею. Риск фанатизма.',
    '8_888888': 'Перегрузка. Человек может "сгореть" ради других. Риск потери себя.',

    // === 9 — ПАМЯТЬ ===
    '9_empty': 'Память очень слабая. "Золотая рыбка". Человек злопамятен, долго не может отпустить обиды. Ему нужно учиться прощать.',
    '9_9': 'Память хорошая, но избирательная. Помнит то, что ему интересно. Обиды помнит, но может простить, если захочет.',
    '9_99': 'Очень хорошая, "фотографическая" память. Умный, способный к обучению. Но злопамятен — обид не прощает никогда.',
    '9_999': 'Очень сильная память и дар предвидения. "Пророк". Человек видит закономерности там, где другие их не замечают. Ему нужно быть осторожным со словами — они сбываются.',
    '9_9999': 'Абсолютная память. Человек помнит всё. Может быть гениальным ученым или мистиком.',
    '9_99999': 'Космическая память. Человек может помнить прошлые жизни. Риск ухода в эзотерику.',
    '9_999999': 'Перегрузка. Человек может быть "застрявшим" в прошлом. Риск депрессии и одиночества.',

    interpretation_unavailable: 'Подробное описание пока недоступно.',

    compatibility: {
      // Основные заголовки экрана
      subtitle: 'Проверьте нумерологическую совместимость',
      partner1Label: 'Дата рождения партнёра 1',
      partner1Placeholder: 'ДД.ММ.ГГГГ',
      partner2Label: 'Дата рождения партнёра 2',
      partner2Placeholder: 'ДД.ММ.ГГГГ',
      buttonText: 'Рассчитать совместимость',
      loadingText: 'Анализ совместимости...',

      compatibilityResultsTitle: 'Совместимость',

      // Секции результатов
      lpAnalysisSection: 'Анализ Чисел Жизненного Пути',
      baseParamsSection: 'Базовая совместимость',
      premiumParamsSection: 'Глубинная совместимость',
      baseTotal: 'Базовая совместимость',
      fullTotal: 'Полная совместимость',
      recommendations: 'Рекомендации для пары',

      // Заголовки в карточке анализа
      lpTitle: 'Числа Жизненного Пути',
      destinyTitle: 'Число Союза',
      missionLabel: 'Миссия Пары',
      summaryLabel: 'Общий Вывод',

      // Миссия по Числу Союза (1–9)
      destinyMission_1: 'Вместе вы — лидеры и первопроходцы. Ваша сила в инициативе и смелости начинать новое.',
      destinyMission_2: 'Вы учителя гармонии, дипломатии и настоящей близости. Ваша миссия — исцелять отношения.',
      destinyMission_3: 'Вы несёте в мир радость, творчество и вдохновение. Вместе вы — источник света и красоты.',
      destinyMission_4: 'Вы строите надёжные фундаменты: дом, бизнес, традиции. Ваша сила — в стабильности и труде.',
      destinyMission_5: 'Вы — катализаторы свободы и перемен. Ваша пара разрушает старое и открывает новые горизонты.',
      destinyMission_6: 'Вы исцеляете через любовь, заботу и красоту. Ваша миссия — создавать гармонию и уют.',
      destinyMission_7: 'Вы ищете и передаёте высшую истину. Вместе вы — духовные проводники и исследователи.',
      destinyMission_8: 'Вы овладеваете властью и ресурсами, чтобы служить большому делу. Сила через ответственность.',
      destinyMission_9: 'Вы завершаете старые циклы и служите человечеству. Ваша любовь — глобальна и бескорыстна.',

      // Параметры совместимости
      energy: 'Энергия и жизненная сила',
      character: 'Характер и воля',
      interest: 'Интересы и творчество',
      karma: 'Кармическая связь',
      family: 'Семья и быт',
      talent: 'Таланты и самореализация',
      spirituality: 'Духовность и смысл',

      // Подписи партнёров
      partner1: 'Партнёр 1',
      partner2: 'Партнёр 2',

      destinyFallback: {
        overview: "Анализ пока недоступен.",
        mission: "Информация о миссии союза пока недоступна.",
        purpose: "Цели уточняются.",
        summary: "Вывод не сформирован."
      },
    },

    // SECTION TITLES
    section_workingNumbers: 'Дополнительные числа',
    section_psychomatrix: 'Психоматрица (Квадрат Пифагора)',

    // WORKING NUMBERS DISPLAY
    workingNumberLabel: '{number}-е раб. число',
    destinyNumberLabel: 'Число Судьбы',

    // ERRORS
    errorNotFound: 'Ошибка',
    errorDataNotFound: 'Данные не найдены.',
    workingNumberInterpretation: 'Интерпретация числа {value}:',

    // LOADING SCREEN
    loadingNumerology: 'Загрузка нумерологии...',

    // COMPATIBILITY SCREEN
    compatibilityComingSoon: 'Скоро: Совместимость',
    compatibilityDescription: 'Проверка нумерологической совместимости с партнером.',

    // NUMBERS SCREEN
    numbersScreenTitle: 'Числа Судьбы',
    numbersDescription: 'Здесь будет расчет номера телефона и номера автомобиля. (PRO-функция)',

    // LANGUAGE BUTTON
    changeLanguageAlert: 'Сменить язык!',

    auth: {
      welcome: 'Добро пожаловать',
      google: 'Продолжить с Google',
      email: 'Email',
      password: 'Пароль',
      login: 'Войти',
      noAccount: 'Нет аккаунта? Зарегистрируйся',
      emailInvalid: 'Email недействителен',
      passwordShort: 'Пароль должен быть ≥6 символов',

      register: 'Регистрация',
      createAccount: 'Создать аккаунт',
      haveAccount: 'Уже есть аккаунт? Войти',

      forgotPassword: 'Забыли пароль?',
      resetPassword: 'Сброс пароля',
      enterEmailToReset: 'Пожалуйста, введите ваш email для сброса пароля.',
      resetEmailSent: 'Инструкции по сбросу пароля отправлены на ваш email.',
      userNotFound: 'Пользователь с таким email не найден.',
      displayName: "Имя пользователя",
      displayNameShort: 'Имя должно быть длиннее 2 символов',

      emailUsedRedirectLogin: 'Этот email уже зарегистрирован. Желаете войти?',
      goToLogin: 'Войти',

      wrongPasswordOrUserNotFound: 'Неверный email или пароль.',
    },
    common: {
      error: 'Ошибка',
      success: 'Успех',
      tryAgain: 'Попробуйте снова',
      cancel: 'Отмена',
      done: 'Готово',
      save: 'Сохранить',
      back: 'Назад',
      networkError: 'Ошибка сети. Проверьте подключение.',
    },
    profile: {
      hello: 'Здравствуйте,',
      editProfile: 'Редактировать профиль',
      changeBirthDate: 'Изменить дату рождения',
      changeLanguage: 'Сменить язык',
      premiumActive: 'Премиум активен',
      getPremium: 'Оформить Premium',
      addAccount: 'Добавить аккаунт',
      logout: 'Выйти из аккаунта',
      deleteAccount: 'Удалить аккаунт',
      loginOrRegister: 'Войти / Зарегистрироваться',
      guest: 'Гость',
    },

    alerts: {
      logout: 'Выйти из аккаунта?',
      deleteAccount: 'Вы уверены? Это действие нельзя отменить.',
      deleteAccountTitle: 'Удаление аккаунта',
      cancel: 'Отмена',
      logoutButton: 'Выйти',
      deleteButton: 'Удалить',
    },
    currentLanguage: 'ru',
    date: {
      months: [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
      ],
    },

  },
  en: {
    title: 'Date Code',

    onboarding: {
      subtitle: 'Discover your Destiny Matrix\nand unlock your potential',
      guestButton: 'Continue as Guest',
      loginButton: 'I already have an account',
      legal: 'By tapping "Continue", you agree\nto our Terms of Use',
    },

    subtitle: 'Calculate your Pythagorean Square',
    inputPlaceholder: 'Enter birth date (DD.MM.YYYY)',
    buttonText: 'Calculate',
    loadingText: 'Calculating...',

    tabs: {
      pythagoras: 'Psychomatrix',
      compatibility: 'Compatibility',
      numbers: 'Numbers'
    },

    errorEmpty: 'Enter a date',
    errorFormat: 'Format: DD.MM.YYYY',
    errorInvalid: 'Invalid date',

    // TOOLTIPS
    tooltip_weak_character: 'Weak will',
    tooltip_strong_character: 'Strong leader',
    tooltip_weak_energy: 'No energy',
    tooltip_strong_energy: 'High energy',
    tooltip_weak_health: 'Poor health',
    tooltip_weak_logic: 'Weak logic',
    tooltip_weak_laziness: 'Lazy',
    tooltip_weak_responsibility: 'Carelessness',
    tooltip_weak_memory: 'Poor memory',

    tooltip_develop: 'Develop!',
    tooltip_superpower: 'Superpower!',
    tooltip_genius: 'Genius!',
    tooltip_godlike: 'Godlike!',
    tooltip_strong_creativity: 'Creativity',
    tooltip_strong_logic: 'Strong logic',
    tooltip_strong_temperament: 'Temperament',
    tooltip_strong_luck: 'Luck',
    tooltip_strong_responsibility: 'Responsibility',
    tooltip_strong_memory: 'Memory',

    // ADDITIONAL NUMBERS
    working1_title: '1st Working Number',
    working1_desc: 'This is the “raw” life potential you bring into the world.',
    working2_title: '2nd Working Number (Life Path Number)',
    working2_desc: 'It reveals your main life task and mission.',
    working3_title: '3rd Working Number',
    working3_desc: 'This is the “karmic adjustment” – the lesson you must work through.',
    working4_title: '4th Working Number',
    working4_desc: 'It is the practical “key” to solving the karmic tasks.',
    destiny_title: 'Life Path Number',
    destiny_desc: 'It is your guiding star throughout life.',

    // === CELLS ===
    cell_1_title: 'Character',
    cell_2_title: 'Energy',
    cell_3_title: 'Interest',
    cell_4_title: 'Health',
    cell_5_title: 'Logic',
    cell_6_title: 'Labor',
    cell_7_title: 'Luck',
    cell_8_title: 'Duty',
    cell_9_title: 'Memory',

    // === 1 — CHARACTER ===
    '1_empty': 'No 1s. Soft, compliant character. The person finds it hard to make decisions and often seeks support from others. May be a follower.',
    '1_1': 'Self-centered but weak-willed character. Focused on themselves, yet lacks the inner strength to achieve big goals alone.',
    '1_11': 'Golden mean. Soft yet not spineless. Good at compromise, diplomatic, praises others while not forgetting themselves.',
    '1_111': 'Strong, determined character. Has a “core”. Can lead, make decisions, and is hard to persuade in arguments. Balanced.',
    '1_1111': 'Very strong, “golden” character. Determined, goal-oriented, but can be overly harsh and blunt.',
    '1_11111': 'Dictator. Extremely rigid, domineering character. Tolerates no objections and strives for absolute power. Impossible to convince.',
    '1_111111': 'Overload. Despotic, often difficult to live with. The person struggles with themselves; outbursts or withdrawal are possible.',

    // === 2 — ENERGY ===
    '2_empty': 'No energy. An “energy vampire” (usually unconsciously). Tires quickly, needs recharge from others, loves crowds. Requires active rest.',
    '2_2': 'Low energy. A modest donor. Prone to laziness, weather-sensitive. Needs sport and fresh air to replenish.',
    '2_22': 'Normal energy level. Can share energy, a good donor. Active, cheerful. Enough for family and work.',
    '2_222': 'Sign of a psychic. Very strong energy. Can heal with hands or words. Must release excess (sport, hobbies) to avoid conflicts.',
    '2_2222': 'Super-strong energy. A donor for everyone. People are drawn to recharge. Must learn to replenish own resources.',
    '2_22222': 'Energy overflow. Hyperactive, restless. Risk of burnout. Direct energy into creation.',
    '2_222222': 'Energy overload. May become uncontrollable, aggressive. Needs strict self-discipline and meditation.',

    // === 3 — INTEREST ===
    '3_empty': 'No 3s. A “techie”. Struggles with humanities. Very tidy, perfectionist, picky about details.',
    '3_3': 'Interest in sciences comes in waves. One day a humanist, the next a techie – depends on mood.',
    '3_33': 'Clear aptitude for exact sciences (physics, math). A true techie to the core. Logical.',
    '3_333': 'Very strong scientific interest. Potential great scientist. If unrealized, turns into criticism and stinginess.',
    '3_3333': 'Genius in science. May discover something new, but risks detachment from reality.',
    '3_33333': 'Super-genius. Sees the world as a system. May be misunderstood by contemporaries.',
    '3_333333': 'Overload. May live in a world of ideas, detached from life. Risk of mental disorders.',

    // === 4 — HEALTH ===
    '4_empty': 'Very weak natural health. Sickly since childhood. Must constantly strengthen the body – hardening, sport.',
    '4_4': 'Health exists but not heroic. Take care, especially after 40-50. Serious illnesses unlikely, chronic ones possible.',
    '4_44': 'Naturally strong, “heroic” health. High pain threshold, endurance. Suitable for professional sports.',
    '4_444': 'Super-strong health. Very robust immunity. Almost never sick. Huge physical reserve.',
    '4_4444': 'Invincible health. Can withstand any stress. Top-level regeneration.',
    '4_44444': 'Superhuman stamina. Can survive extreme conditions. Risk of ignoring fatigue.',
    '4_444444': 'Overload. Body may rebel from excess strength. Risk of injury due to carelessness.',

    // === 5 — LOGIC ===
    '5_empty': 'No logic or intuition. Builds castles in the air, lives in illusions. Hard to plan. Decisions are emotional, often wrong.',
    '5_5': 'Logic present. Can analyze, but intuition weak. Relies on facts more than on “sixth sense”.',
    '5_55': 'Very strong intuition. “Sixth sense” works perfectly. Sees prophetic dreams, predicts events. Just knows.',
    '5_555': 'Clairvoyant. Intuition borders on super-ability. Always knows what to say or do. Cannot be deceived.',
    '5_5555': 'Overload. Intuition is so strong it interferes with life. Feels too much, suffers, often withdrawn.',
    '5_55555': 'Absolute clairvoyance. Can see past and future. Risk of losing touch with reality.',
    '5_555555': 'Overload. May be “outside this world”. Risk of mental disorders or deep mysticism.',

    // === 6 — LABOR ===
    '6_empty': 'Not grounded. Dislikes physical labor, prefers mental work. Needs a hands-on hobby to ground.',
    '6_6': 'Golden hands, but works only when in the mood. Resists if forced.',
    '6_66': 'Master with golden hands. Loves physical work, does everything at home. Best rest is garage or garden.',
    '6_666': 'Sign of the beast or temperament. Very attractive to the opposite sex, but highly conflict-prone. Must channel energy into labor.',
    '6_6666': 'Workhorse. Ready to work 24/7, often at the expense of self and family. Sees only work.',
    '6_66666': 'Extreme workaholic. Works to exhaustion. Risk of burnout and health issues.',
    '6_666666': 'Overload. May become a slave to labor. Risk of losing family, health, meaning of life.',

    // === 7 — LUCK ===
    '7_empty': 'No luck. Must achieve everything by own effort and intellect. No freebies. Develop talent.',
    '7_7': 'Little luck. Wins small things. Success requires great effort.',
    '7_77': 'Lucky one. Angelic luck sign. Often gets lucky, escapes trouble. Should take risks.',
    '7_777': 'Very strong luck. Can control luck, but it’s a responsibility – misuse may turn it away.',
    '7_7777': 'Absolute luck. Golden child of fate. Everything works out effortlessly. Risk of arrogance.',
    '7_77777': 'Cosmic luck. Can change destinies. Risk of pride and detachment.',
    '7_777777': 'Overload. Luck may burn out. Risk of tragedy to balance karma.',

    // === 8 — DUTY ===
    '8_empty': 'No sense of duty. Everyone owes me. Lives for self, ignores others. Needs to learn responsibility.',
    '8_8': 'Developed sense of duty. Responsible, honest, decent. May neglect own interests while helping others.',
    '8_88': 'Very strong sense of duty. Hyper-responsible. Sacrifices everything for family/friends.',
    '8_888': 'Truth-teller sign. Absolute duty and justice. Serves people and truth. Suitable for politics, judiciary.',
    '8_8888': 'Saintly duty. Lives for others. May become a spiritual leader. Risk of depletion.',
    '8_88888': 'Absolute self-sacrifice. May give life for an idea. Risk of fanaticism.',
    '8_888888': 'Overload. May burn out for others. Risk of losing self.',

    // === 9 — MEMORY ===
    '9_empty': 'Very weak memory. Goldfish. Holds grudges long. Needs to learn forgiveness.',
    '9_9': 'Good but selective memory. Remembers what interests them. Can forgive grudges if desired.',
    '9_99': 'Photographic memory. Intelligent, quick learner. Never forgives offenses.',
    '9_999': 'Very strong memory and foresight. Prophet. Sees patterns others miss. Words tend to come true – be careful.',
    '9_9999': 'Absolute memory. Remembers everything. Potential genius scientist or mystic.',
    '9_99999': 'Cosmic memory. May recall past lives. Risk of deep esoteric immersion.',
    '9_999999': 'Overload. May be stuck in the past. Risk of depression and loneliness.',

    interpretation_unavailable: 'Detailed description not yet available.',

    back: 'Back',
    pythagorasTitle: 'Pythagoras Square',
    analysisTitle: 'Date Analysis',
    compatibilityTitle: 'Compatibility',
    numbersTitle: 'Numbers',

    compatibility: {
      subtitle: 'Check your numerological compatibility',
      partner1Label: 'Partner 1 birth date',
      partner1Placeholder: 'DD.MM.YYYY',
      partner2Label: 'Partner 2 birth date',
      partner2Placeholder: 'DD.MM.YYYY',
      buttonText: 'Calculate Compatibility',
      loadingText: 'Analyzing compatibility...',

      compatibilityResultsTitle: 'Compatibility',

      lpAnalysisSection: 'Life Path Numbers Analysis',
      baseParamsSection: 'Core Compatibility',
      premiumParamsSection: 'Deep Compatibility',
      baseTotal: 'Core Compatibility',
      fullTotal: 'Full Compatibility',
      recommendations: 'Recommendations for the Couple',

      lpTitle: 'Life Path Numbers',
      destinyTitle: 'Union Number',
      missionLabel: 'Union Mission',
      summaryLabel: 'General Conclusion',

      // Destiny Mission (1–9)
      destinyMission_1: 'Together you are leaders and trailblazers. Your strength lies in initiative and courage.',
      destinyMission_2: 'You are teachers of harmony, diplomacy, and true intimacy. Your mission is to heal relationships.',
      destinyMission_3: 'You bring joy, creativity, and inspiration to the world. Together you are a source of light.',
      destinyMission_4: 'You build strong foundations: home, business, traditions. Your power is in stability and work.',
      destinyMission_5: 'You are catalysts of freedom and change. Your couple breaks the old and opens new horizons.',
      destinyMission_6: 'You heal through love, care, and beauty. Your mission is to create harmony and comfort.',
      destinyMission_7: 'You seek and transmit higher truth. Together you are spiritual guides and explorers.',
      destinyMission_8: 'You master power and resources to serve a greater cause. Strength through responsibility.',
      destinyMission_9: 'You complete old cycles and serve humanity. Your love is global and selfless.',

      energy: 'Energy & Vitality',
      character: 'Character & Willpower',
      interest: 'Interests & Creativity',
      karma: 'Karmic Connection',
      family: 'Family & Home Life',
      talent: 'Talents & Self-Realization',
      spirituality: 'Spirituality & Purpose',

      partner1: 'Partner 1',
      partner2: 'Partner 2',

      destinyFallback: {
        overview: "Analysis currently unavailable.",
        mission: "Union mission details are unavailable.",
        purpose: "Goals are being defined.",
        summary: "Conclusion could not be generated."
      },
    },

    // SECTION TITLES
    section_workingNumbers: 'Additional Numbers',
    section_psychomatrix: 'Psychomatrix (Pythagorean Square)',

    // WORKING NUMBERS DISPLAY
    workingNumberLabel: '{number}th Working Number',
    destinyNumberLabel: 'Destiny Number',

    // ERRORS
    errorNotFound: 'Error',
    errorDataNotFound: 'Data not found.',
    workingNumberInterpretation: 'Interpretation of number {value}:',

    // LOADING SCREEN
    loadingNumerology: 'Loading numerology...',

    // COMPATIBILITY SCREEN
    compatibilityComingSoon: 'Coming Soon: Compatibility',
    compatibilityDescription: 'Check numerological compatibility with a partner.',

    // NUMBERS SCREEN
    numbersScreenTitle: 'Destiny Numbers',
    numbersDescription: 'Phone number and car license plate calculations will be here. (PRO feature)',

    auth: {
      welcome: 'Welcome back',
      google: 'Continue with Google',
      email: 'Email',
      password: 'Password',
      login: 'Log in',
      noAccount: 'Don’t have an account? Sign up',
      emailInvalid: 'Invalid email',
      passwordShort: 'Password must be ≥6 characters',

      register: 'Sign up',
      createAccount: 'Create account',
      haveAccount: 'Already have an account? Log in',

      forgotPassword: 'Forgot password?',
      resetPassword: 'Password Reset',
      enterEmailToReset: 'Please enter your email to reset your password.',
      resetEmailSent: 'Password reset instructions have been sent to your email.',
      userNotFound: 'No user found with this email.',

      emailUsedRedirectLogin: 'This email is already registered. Would you like to log in?',
      goToLogin: 'Log in',
      displayNameShort: 'Name must be longer than 2 characters',

      wrongPasswordOrUserNotFound: 'Invalid email or password.',
    },
    common: {
      error: 'Error',
      success: 'Success',
      tryAgain: 'Try again',
      cancel: 'Cancel',
      done: 'Done',
      save: 'Save',
      back: 'Back',
      networkError: 'Network error. Check your connection.',
    },
    profile: {
      hello: 'Hello,',
      editProfile: 'Edit Profile',
      changeBirthDate: 'Change Birth Date',
      changeLanguage: 'Change Language',
      premiumActive: 'Premium Active',
      getPremium: 'Get Premium',
      addAccount: 'Add Account',
      logout: 'Log Out',
      deleteAccount: 'Delete Account',
      loginOrRegister: 'Log In / Sign Up',
      guest: 'Guest',
    },
    alerts: {
      logout: 'Log out of account?',
      deleteAccount: 'Are you sure? This cannot be undone.',
      deleteAccountTitle: 'Delete Account',
      cancel: 'Cancel',
      logoutButton: 'Log Out',
      deleteButton: 'Delete',
    },

    currentLanguage: 'en',
    date: {
      months: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
    },

  },
};

let currentLocale: Locale = 'en';

export const setLocale = (locale: Locale) => {
  currentLocale = locale;
};

export const getCurrentLocale = (): Locale => {
  return currentLocale;
};

export const t = (path: string, lang?: Locale): string => {
  const locale = lang || currentLocale;
  const keys = path.split('.');
  let result: any = translations[locale];

  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) return path; // fallback
  }

  // Support simple placeholder replacement for {value} or {number}
  if (typeof result === 'string' && (result.includes('{value}') || result.includes('{number}'))) {
    // This is a template string - return as is for now
    // Components will need to handle replacement manually
  }

  return typeof result === 'string' ? result : path;
};

export const tArray = (path: string, lang?: Locale): any[] => {
  const locale = lang || currentLocale;
  const keys = path.split('.');
  let result: any = translations[locale];

  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) return [];
  }

  return Array.isArray(result) ? result : [];
};

export const tObject = (path: string, lang?: Locale): Record<string, any> => {
  const locale = lang || currentLocale;
  const keys = path.split('.');
  let result: any = translations[locale];

  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) return {};
  }

  return typeof result === 'object' && result !== null && !Array.isArray(result) ? result : {};
};

// lib/constants/numerologyTexts.ts

export interface CompatibilityTexts {
  lpAnalysis: Record<string, {
    title: string;
    strengths: string;
    challenges: string;
    focus: string;
  }>;
  destinyAnalysis: Record<string, {
    overview: string;
    mission: string;
    purpose: string;
    summary: string;
    challenges: string[];
    advice: string;
  }>;
  cellDescriptions: Record<string, string>;
  recommendations: Record<string, string[]>;
}

export const RU_NUMEROLOGY_CONTENT: CompatibilityTexts = {
  lpAnalysis: {
    "1-1": { title: "Союз Двух Лидеров", strengths: "Огромная энергия, амбиции, умение брать ответственность. Вместе вы способны построить империю.", challenges: "Борьба за власть, эго, нежелание уступать. Без чёткого разделения ролей союз рушится.", focus: "Научитесь делить сферы влияния и искренне восхищаться сильными сторонами друг друга." },
    "1-2": { title: "Союз Импульса и Чуткости", strengths: "1 даёт драйв и направление, 2 — дипломатию, поддержку и эмоциональный комфорт.", challenges: "1 кажется 2 грубым и эгоистичным, 2 кажется 1 слишком медленным и нерешительным.", focus: "1 учится прислушиваться к интуиции 2, 2 доверяет решительности 1." },
    "1-3": { title: "Союз Творческих Амбиций", strengths: "Яркая, харизматичная пара. Легко вдохновляете друг друга и мир вокруг.", challenges: "Ревность к вниманию, борьба за главную роль на сцене.", focus: "Превратить творчество 3 в совместные проекты, где 1 выступает продюсером и стратегом." },
    "1-4": { title: "Союз Мечты и Фундамента", strengths: "1 приносит идеи и харизму, 4 — стабильность, дисциплину и умение воплощать.", challenges: "1 считает 4 скучным и консервативным, 4 считает 1 безответственным фантазёром.", focus: "Создать систему, где 1 генерирует идеи, а 4 их надёжно реализует." },
    "1-5": { title: "Союз Свободных Душ", strengths: "Свобода, приключения, постоянное развитие. Никогда не бывает скучно.", challenges: "Трудно создавать быт и долгосрочные обязательства.", focus: "Договориться о минимальных «якорях» — общий дом, финансовая подушка, общие ценности." },
    "1-6": { title: "Союз Карьеры и Семьи", strengths: "1 обеспечивает рост и статус, 6 — тепло, уют и эмоциональную базу.", challenges: "1 часто отсутствует дома, 6 чувствует себя брошенным и недооценённым.", focus: "1 выделяет время на семью, 6 поддерживает амбиции 1 без упрёков." },
    "1-7": { title: "Союз Независимых Умов", strengths: "Интеллектуальная свобода, глубокие разговоры, уважение личного пространства.", challenges: "Эмоциональная прохлада, нехватка физической близости и тепла.", focus: "Сознательно создавать ритуалы нежности и открыто говорить о чувствах." },
    "1-8": { title: "Союз Власти и Богатства", strengths: "Мощная бизнес-пара. 1 — визионер, 8 — стратег и управленец.", challenges: "Жёсткая борьба за контроль и финансы.", focus: "Чётко разделить зоны ответственности и уважать силу друг друга." },
    "1-9": { title: "Союз Лидерства и Гуманизма", strengths: "Вместе можете менять мир к лучшему, запускать крупные социальные и гуманитарные проекты.", challenges: "1 стремится к личной славе и признанию, 9 — к бескорыстному служению без эго.", focus: "Направить амбиции 1 на глобальные, альтруистические цели 9." },

    "2-2": { title: "Союз Двух Душ", strengths: "Глубочайшая эмоциональная связь, интуитивное понимание без слов.", challenges: "Сверхчувствительность, склонность обижаться и уходить в себя.", focus: "Учиться говорить прямо о чувствах, не накапливая обиды." },
    "2-3": { title: "Союз Чувственности и Творчества", strengths: "Лёгкие, вдохновляющие отношения, полные красоты и романтики.", challenges: "2 требует глубины, 3 может быть поверхностным и ветреным.", focus: "3 учится эмоциональной ответственности, 2 — не душить творчество контролем." },
    "2-4": { title: "Союз Уюта и Надёжности", strengths: "Очень тёплый, семейный союз. Прекрасная основа для дома и детей.", challenges: "2 может казаться 4 слишком эмоциональным и непрактичным.", focus: "Создать традиции и ритуалы, которые питают обоих." },
    "2-5": { title: "Союз Чувства и Свободы", strengths: "2 даёт глубину, 5 — яркость и новизну. Очень страстно.", challenges: "2 боится одиночества, 5 боится обязательств.", focus: "Договориться о балансе свободы и близости." },
    "2-6": { title: "Союз Двух Заботливых Сердец", strengths: "Идеальная семейная пара, полная любви и взаимопомощи.", challenges: "Склонность растворяться друг в друге и забывать о себе.", focus: "Сохранять личные интересы и пространство." },
    "2-7": { title: "Союз Души и Духа", strengths: "Очень глубокая духовная связь, телепатическое понимание.", challenges: "Оба могут уходить в себя и избегать реальности.", focus: "Вместе заниматься духовными практиками и помогать друг другу заземляться." },
    "2-8": { title: "Союз Чувства и Власти", strengths: "2 смягчает жёсткость 8, 8 даёт 2 защиту и статус.", challenges: "8 может подавлять 2, 2 — манипулировать слезами.", focus: "8 учится нежности, 2 — уверенности и прямолинейности." },
    "2-9": { title: "Союз Любви и Миссии", strengths: "Очень красивая, вдохновляющая пара, которая может помогать тысячам людей.", challenges: "9 часто ставит мир выше личных отношений.", focus: "2 учится отпускать, 9 — возвращаться домой к партнёру." },

    "3-3": { title: "Союз Двух Звёзд", strengths: "Ярко, весело и творчески. Вы — центр любой компании.", challenges: "Ревность, борьба за внимание, незавершённые проекты.", focus: "Направлять энергию в совместное творчество, а не в конкуренцию." },
    "3-4": { title: "Союз Творчества и Порядка", strengths: "3 приносит радость и креатив, 4 — структуру и стабильность.", challenges: "4 раздражается от хаоса 3, 3 душится от контроля.", focus: "4 даёт безопасные рамки, в которых 3 может творить." },
    "3-5": { title: "Союз Веселья и Приключений", strengths: "Самая лёгкая и яркая пара. Постоянный праздник.", challenges: "Мало глубины и ответственности.", focus: "Иногда останавливаться и говорить о серьёзном." },
    "3-6": { title: "Союз Красоты и Гармонии", strengths: "Эстетически прекрасная пара, любящая искусство и уют.", challenges: "6 требует ответственности, которую 3 не любит.", focus: "3 учится доводить дела до конца ради семьи." },
    "3-7": { title: "Союз Творчества и Мудрости", strengths: "3 даёт лёгкость, 7 — глубину. Очень интересный творческий тандем.", challenges: "7 может считать 3 поверхностным.", focus: "Создавать совместные проекты на стыке искусства и философии." },
    "3-8": { title: "Союз Шоу и Бизнеса", strengths: "3 — лицо бренда, 8 — мозг и деньги. Отличная команда для успеха.", challenges: "8 считает 3 несерьёзным, 3 считает 8 скучным.", focus: "Доверять ролям: 3 — харизма, 8 — стратегия." },
    "3-9": { title: "Союз Таланта и Идеалов", strengths: "Могут создать что-то вечное — книгу, фильм, движение.", challenges: "9 требует жертвенности, которую 3 не готов приносить.", focus: "Направить талант 3 на большую миссию 9." },

    "4-4": { title: "Союз Двух Фундаментов", strengths: "Непробиваемая стабильность, надёжность, общие долгосрочные цели.", challenges: "Скука, рутина, отсутствие страсти.", focus: "Сознательно вносить новизну и романтику." },
    "4-5": { title: "Союз Стабильности и Перемен", strengths: "4 даёт надёжный тыл, 5 — яркость и развитие.", challenges: "4 боится перемен, 5 задыхается от контроля.", focus: "4 учится отпускать, 5 — возвращаться домой." },
    "4-6": { title: "Союз Домашнего Очага", strengths: "Классическая крепкая семья, дом — полная чаша.", challenges: "Могут застрять в быту и забыть о личных мечтах.", focus: "Поддерживать мечты друг друга вне семьи." },
    "4-7": { title: "Союз Практичности и Духовности", strengths: "4 заземляет 7, 7 расширяет горизонты 4.", challenges: "4 считает 7 оторванным от реальности.", focus: "Вместе заниматься духовными практиками с практическим результатом." },
    "4-8": { title: "Союз Двух Строителей Империи", strengths: "Мощнейший тандем для создания большого бизнеса и богатства.", challenges: "Оба упрямые, борьба за контроль.", focus: "Объединить силы вместо конкуренции." },
    "4-9": { title: "Союз Труда и Идеалов", strengths: "Могут построить что-то очень ценное для общества — фонд, экопоселение.", challenges: "4 хочет конкретного результата, 9 — глобальной идеи.", focus: "4 воплощает мечты 9 в реальность." },

    "5-5": { title: "Союз Двух Свобод", strengths: "Максимальная свобода, приключения, страсть. Никаких рамок.", challenges: "Нет стабильности, трудно растить детей и строить быт.", focus: "Создать «островок безопасности» посреди свободы." },
    "5-6": { title: "Союз Свободы и Семьи", strengths: "5 приносит новизну, 6 — тепло. Очень живая семья.", challenges: "5 убегает от рутины, 6 требует постоянства.", focus: "5 учится быть дома, 6 — отпускать без страха." },
    "5-7": { title: "Союз Путешественников Духа", strengths: "Постоянное развитие, духовные поиски, путешествия.", challenges: "Могут потерять связь с реальностью.", focus: "Заземлять открытия в практической жизни." },
    "5-8": { title: "Союз Риска и Стратегии", strengths: "5 генерирует идеи, 8 их монетизирует. Отличная бизнес-пара.", challenges: "5 не любит контроль, 8 не терпит хаоса.", focus: "Доверять зонам компетенции друг друга." },
    "5-9": { title: "Союз Свободы и Миссии", strengths: "Могут изменить мир, путешествуя и вдохновляя людей.", challenges: "9 требует жертв, 5 не хочет ограничивать себя.", focus: "Найти миссию, которая не противоречит свободе." },

    "6-6": { title: "Союз Идеальной Семьи", strengths: "Максимальная забота, любовь, красота в отношениях.", challenges: "Склонность к гиперопеке и контролю из любви.", focus: "Давать друг другу свободу при сохранении близости." },
    "6-7": { title: "Союз Души и Духа", strengths: "Глубокая духовная и эмоциональная связь.", challenges: "Могут уходить от реальности в мир идеалов.", focus: "Вместе помогать людям практическими способами." },
    "6-8": { title: "Союз Семьи и Статуса", strengths: "Красивая, успешная, уважаемая пара.", challenges: "8 может ставить статус выше чувств.", focus: "8 учится нежности, 6 — амбициям." },
    "6-9": { title: "Союз Любви и Служения", strengths: "Могут создать семью, которая помогает сотням людей.", challenges: "9 часто жертвует семьёй ради мира.", focus: "Сделать свою семью частью большой миссии." },

    "7-7": { title: "Союз Двух Мистиков", strengths: "Телепатическая связь, общие духовные открытия.", challenges: "Эмоциональная закрытость, одиночество вдвоём.", focus: "Учиться открывать сердце, а не только разум." },
    "7-8": { title: "Союз Духа и Материи", strengths: "7 даёт глубину, 8 — реализацию в мире. Мощный тандем.", challenges: "7 считает 8 материалистом, 8 считает 7 непрактичным.", focus: "Объединить мудрость и силу." },
    "7-9": { title: "Союз Двух Учителей", strengths: "Могут стать духовными лидерами, учителями человечества.", challenges: "Оба могут быть слишком оторванными от земли.", focus: "Заземлять знания в практической помощи людям." },

    "8-8": { title: "Союз Двух Императоров", strengths: "Мощнейшая энергия успеха, богатства, влияния.", challenges: "Жёсткая борьба за власть, никто не хочет уступать.", focus: "Объединить силы вместо войны." },
    "8-9": { title: "Союз Власти и Мудрости", strengths: "Могут построить этичную империю, которая служит людям.", challenges: "8 хочет власти и контроля, 9 — бескорыстного служения.", focus: "Направить силу 8 на идеалы 9." },

    "9-9": { title: "Союз Двух Миссий", strengths: "Огромная сила менять мир к лучшему.", challenges: "Могут забыть о личных отношениях ради человечества.", focus: "Сделать свои отношения частью большой миссии." }
  },

  destinyAnalysis: {
    "1": {
      overview: "Число 1 как Число Союза — это союз двух первопроходцев. Вы созданы начинать новое, быть лидерами и вдохновлять мир своим примером.",
      mission: "Вместе вы пришли стать лидерами и первопроходцами. Ваша задача — начинать новое, вдохновлять других своим примером.",
      purpose: "Создавать проекты, бизнесы, движения, которые меняют правила игры и задают тренды.",
      summary: "Вы — мощная стартап-пара. Там, где другие боятся, вы действуете. Главное — не соревноваться друг с другом, а идти плечом к плечу.",
      challenges: [
        "Склонность соревноваться друг с другом",
        "Эго может раздуваться до небес",
        "Риск сгореть от амбиций"
      ],
      advice: "Идите рядом, а не наперегонки. Побеждайте вместе — и мир падёт к вашим ногам."
    },
    "2": {
      overview: "Число 2 — это союз гармонии, дипломатии и глубокой эмоциональной близости. Вы учитесь друг у друга терпению, эмпатии и настоящему партнёрству.",
      mission: "Ваша совместная миссия — учить мир сотрудничеству, дипломатии и настоящей близости.",
      purpose: "Быть примером идеальных отношений, помогать людям мириться, создавать мир и баланс вокруг себя.",
      summary: "Один из самых гармоничных союзов. Вы исцеляете друг друга и мир своей любовью. Главное — не растворяться полностью друг в друге.",
      challenges: [
        "Можно утонуть в чувствах и потерять себя",
        "Излишняя зависимость друг от друга",
        "Трудно говорить «нет» окружающим"
      ],
      advice: "Любите сильно, но дышите свободно. Сохраняйте границы — и ваша гармония станет вечной."
    },
    "3": {
      overview: "Число 3 — это союз радости, творчества и лёгкости. Ваши отношения полны смеха, вдохновения и детской искры.",
      mission: "Вы здесь, чтобы нести радость, творчество и красоту в мир.",
      purpose: "Вдохновлять людей через искусство, слово, юмор, музыку и просто своим существованием.",
      summary: "Вы — пара, от которой светится всё вокруг. Ваша задача — не терять эту искру даже в трудные времена и делиться ею щедро.",
      challenges: [
        "Бегство от серьёзных тем и ответственности",
        "Распыление энергии на тысячу идей",
        "Страх глубокой близости"
      ],
      advice: "Праздник — это прекрасно, но иногда нужно выключить музыку и просто обнять друг друга в тишине."
    },
    "4": {
      overview: "Число 4 — это фундамент, стабильность и долгосрочные достижения. Ваш союз построен на надёжности, труде и общих целях.",
      mission: "Ваша кармическая задача — строить надёжные системы, которые служат поколениям.",
      purpose: "Создавать стабильные бизнесы, крепкие семьи, дома и традиции, которые останутся после вас.",
      summary: "Вы способны построить настоящую империю — семью, бизнес, наследие. Главное — не забывать отдыхать и радоваться процессу.",
      challenges: [
        "Склонность превратить любовь в работу",
        "Застревание в рутине и контроле",
        "Забывать про отдых и спонтанность"
      ],
      advice: "Строить империю — да. Но не забывайте строить и маленькие выходные только для двоих."
    },
    "5": {
      overview: "Число 5 — это свобода, приключения и постоянное развитие. Ваши отношения никогда не стоят на месте — вы вечно в движении.",
      mission: "Вы — катализаторы перемен и свободы. Задача — разрушать устаревшее и открывать новые пути.",
      purpose: "Путешествовать, экспериментировать, учить людей гибкости, смелости и умению отпускать старое.",
      summary: "Самый свободолюбивый союз. Вы не даёте друг другу застаиваться. Главное — научиться возвращаться домой друг к другу.",
      challenges: [
        "Риск никогда не остановиться и не создать дом",
        "Страх обязательств и «приземления»",
        "Может не хватать глубины и стабильности"
      ],
      advice: "Свобода — это не бегство. Настоящая свобода — когда есть место, куда всегда хочется вернуться."
    },
    "6": {
      overview: "Число 6 — это союз любви, красоты, заботы и служения. Ваши отношения — это настоящее искусство быть вместе.",
      mission: "Ваша миссия — исцелять через любовь, красоту и заботу.",
      purpose: "Создавать идеальные семьи, уютные дома, гармоничные сообщества и пространства любви.",
      summary: "Один из самых тёплых и душевных союзов. Вы лечите друг друга прикосновением. Главное — не забывать о себе, отдавая всё окружающим.",
      challenges: [
        "Жертвовать собой ради партнёра и семьи",
        "Перфекционизм в отношениях",
        "Ревность и желание контролировать красоту"
      ],
      advice: "Любовь — это не подвиг. Иногда достаточно просто быть, а не спасать."
    },
    "7": {
      overview: "Число 7 — это духовный союз, поиск истины и глубокое внутреннее развитие. Вы встретились не случайно — это кармическая связь.",
      mission: "Вместе вы ищете и передаёте высшую истину.",
      purpose: "Стать духовными учителями, исследователями, мистиками или просто очень глубокими людьми.",
      summary: "Вы понимаете друг друга без слов. Ваша любовь — тихая, но невероятно мощная. Главное — не уходить в мир иллюзий и оставаться на земле.",
      challenges: [
        "Уход в духовность вместо реальных отношений",
        "Одиночество вдвоём",
        "Сложно говорить о быте и деньгах"
      ],
      advice: "Вы можете летать в космосе душой, но не забывайте платить за квартиру и обнимать друг друга телом."
    },
    "8": {
      overview: "Число 8 в качестве Числа Союза означает, что ваши отношения в первую очередь ориентированы на достижение материального успеха, статуса, власти и признания.",
      mission: "Кармическая задача — овладеть материей и властью, чтобы служить большому делу.",
      purpose: "Строить крупный бизнес, управлять ресурсами мудро и этично, создавать богатство для будущего.",
      summary: "Ваш союз — яркая, сильная и амбициозная пара. Потенциал для больших совместных достижений огромен. Просто помните: деньги и статус — не цель, а инструмент. Не теряйте душу в погоне за успехом.",
      challenges: [
        "Деньги и власть могут стать важнее любви",
        "Жёсткость и контроль вместо нежности",
        "Риск эмоционального выгорания"
      ],
      advice: "Империя без любви — просто куча денег. Не теряйте душу в погоне за вершинами."
    },
    "9": {
      overview: "Число 9 — это глобальная миссия и завершение кармических циклов. Ваша пара пришла в мир, чтобы нести мудрость и служение.",
      mission: "Вы пришли завершить старые циклы и служить человечеству без эго. Ваша любовь — глобальна и бескорыстна.",
      purpose: "Помогать тысячам людей, заниматься благотворительностью, менять мир к лучшему на большом масштабе.",
      summary: "Это один из самых благородных союзов. Вы способны изменить мир. Главное — не забывать о своих личных потребностях и не приносить отношения в жертву бесконечному служению.",
      challenges: [
        "Жертвовать отношениями ради «спасения мира»",
        "Идеализм и разочарование в людях",
        "Трудно жить «здесь и сейчас»"
      ],
      advice: "Мир вы спасёте. Но сначала спасите ваши отношения — они и есть ваш главный вклад в человечество."
    }
  },

  cellDescriptions: {
    "1_0": "Нет единиц — слабая жизненная энергия, сложно проявлять инициативу. Нужно развивать уверенность в себе.",
    "1_1": "Одна единица — мягкое лидерство, человек предпочитает не высовываться.",
    "1_11": "Две единицы — хорошая энергия, уверенность, умение вести за собой.",
    "1_111": "Три единицы — сильный характер, яркое «Я», лидерские качества.",
    "1_1111": "Четыре единицы — очень мощная энергетика, воля, харизма. Иногда переизбыток эго.",
    "1_11111": "Пять единиц — диктаторская энергетика, огромная сила воли. Важно направлять в созидание.",
    "1_111111": "Шесть единиц — крайне редкая концентрация силы. Человек способен менять судьбы стран.",

    "2_0": "Нет двоек — слабая интуиция, сложно чувствовать других. Энергия рассеивается.",
    "2_1": "Одна двойка — интуиция есть, но слабая. Лучше работать над чувствительностью.",
    "2_11": "Две двойки — хорошая энергетика, мягкость, дипломатичность.",
    "2_111": "Три двойки — сильная интуиция, эмпатия, умение чувствовать людей.",
    "2_1111": "Четыре двойки — очень мощная энергетика гармонии, часто целители и психологи.",
    "2_4+": "Пять и более двоек — гиперчувствительность, склонность к жертвам. Нужно учиться границам.",

    "3_0": "Нет троек — сложно радоваться жизни, творческий потенциал спит.",
    "3_1": "Одна тройка — творчество проявляется эпизодически.",
    "3_11": "Две тройки — хороший творческий потенциал, лёгкость, чувство юмора.",
    "3_111": "Три тройки — яркий талант, харизма, умение вдохновлять.",
    "3_4+": "Четыре и более троек — гениальность, но возможна рассеянность и незавершённость.",

    "4_0": "Нет четвёрок — от природы слабое здоровье и нестабильность. Нужно заниматься спортом и режимом.",
    "4_1": "Одна четвёрка — здоровье среднее, нужна дисциплина.",
    "4_11": "Две четвёрки — хорошее здоровье, стабильность, трудолюбие.",
    "4_111": "Три четвёрки — крепкое здоровье, выносливость, надёжность.",
    "4_4+": "Четыре и более четвёрок — железное здоровье и огромная работоспособность.",

    "5_0": "Нет пятёрок — слабая связь с эмоциями, логика преобладает. Трудно понимать свои желания.",
    "5_1": "Одна пятёрка — эмоции сдержанные, логика на первом месте.",
    "5_11": "Две пятёрки — гармония логики и эмоций.",
    "5_111": "Три пятёрки — сильные эмоции, сексуальность, чувственность.",
    "5_4+": "Четыре и более пятёрок — очень эмоциональный человек, возможны перепады настроения.",

    "6_0": "Нет шестёрок — сложно создавать уют и заботиться. Человек больше ориентирован на себя.",
    "6_1": "Одна шестёрка — забота проявляется выборочно.",
    "6_11": "Две шестёрки — гармоничная забота, любовь к красоте и уюту.",
    "6_111": "Три шестёрки — сильная потребность заботиться, иногда гиперопека.",
    "6_4+": "Четыре и более шестёрок — склонность к самопожертвованию ради других.",

    "7_0": "Нет семёрок — слабая связь с духовным, материализм. Жизнь может казаться пустой.",
    "7_1": "Одна семёрка — интерес к духовному есть, но слабый.",
    "7_11": "Две семёрки — хороший духовный потенциал, интуиция.",
    "7_111": "Три семёрки — сильная связь с высшим, талант учителя или целителя.",
    "7_4+": "Четыре и более семёрок — мощная духовная энергетика, часто одиночество.",

    "8_0": "Нет восьмёрок — слабое чувство долга и справедливости. Сложно брать ответственность.",
    "8_1": "Одна восьмёрка — чувство долга есть, но слабое.",
    "8_11": "Две восьмёрки — развитое чувство справедливости и ответственности.",
    "8_111": "Три восьмёрки — сильный долг, лидерство через служение.",
    "8_4+": "Четыре и более восьмёрок — кармическая ответственность, часто тяжёлая судьба.",

    "9_0": "Нет девяток — слабый интеллект и память, сложно учиться.",
    "9_1": "Одна девятка — средний интеллект.",
    "9_11": "Две девятки — хороший ум, память, эрудиция.",
    "9_111": "Три девятки — высокий интеллект, мудрость.",
    "9_4+": "Четыре и более девяток — гениальность, но возможна оторванность от реальности."
  },

  recommendations: {
    "1-1": ["Чётко разделите сферы лидерства", "Учитесь искренне хвалить партнёра", "Создайте совместный большой проект"],
    "1-2": ["1 — учитесь мягкости и дипломатии", "2 — развивайте уверенность в себе", "Создавайте ритуалы эмоциональной близости"],
    "1-3": ["1 — станьте продюсером творчества 3", "3 — уважайте решения 1", "Направляйте энергию в совместные проекты"],
    "1-4": ["1 — обеспечьте 4 стабильность в планах", "4 — не ограничивайте амбиции 1", "Создайте долгосрочный проект: 1 — стратегия, 4 — исполнение"],
    "1-5": ["Договоритесь о минимальных обязательствах", "Создайте общий «островок стабильности»", "Путешествуйте вместе"],
    "1-6": ["1 — выделяйте время на семью", "6 — поддерживайте карьеру 1 без упреков", "Создайте семейные традиции"],
    "1-7": ["Создавайте ритуалы нежности", "Говорите о чувствах открыто", "Занимайтесь совместными духовными практиками"],
    "1-8": ["Разделите зоны контроля", "Уважайте силу друг друга", "Объедините амбиции в один большой бизнес"],
    "1-9": ["Направьте личные амбиции 1 на глобальные цели 9", "9 — цените личные достижения 1", "Создайте совместный гуманитарный проект"],

    "2-2": ["Учитесь говорить о чувствах прямо", "Не копите обиды", "Создавайте ритуалы эмоциональной близости"],
    "2-3": ["3 — учитесь эмоциональной ответственности", "2 — не душите творчество контролем", "Создавайте красивые романтические сюрпризы"],
    "2-4": ["Создавайте семейные традиции", "2 — помогайте 4 с эмоциональной гибкостью", "4 — добавляйте романтики в быт"],
    "2-5": ["Договоритесь о балансе свободы и близости", "5 — возвращайтесь домой", "2 — учитесь отпускать без страха"],
    "2-6": ["Сохраняйте личное пространство", "Не растворяйтесь друг в друге полностью"],
    "2-7": ["Занимайтесь совместными духовными практиками", "Помогайте друг другу заземляться"],
    "2-8": ["8 — учитесь нежности", "2 — развивайте уверенность и прямолинейность"],
    "2-9": ["2 — учитесь отпускать", "9 — возвращайтесь домой к партнёру", "Сделайте отношения частью миссии"],

    "3-3": ["Направляйте энергию в совместное творчество", "Не соревнуйтесь за внимание", "Доводите проекты до конца вместе"],
    "3-4": ["4 — создайте рамки для творчества 3", "3 — уважайте порядок 4", "Запускайте творческий бизнес"],
    "3-5": ["Иногда останавливайтесь и говорите о серьёзном", "Создайте общие долгосрочные цели"],
    "3-6": ["3 — учитесь ответственности ради семьи", "6 — давайте 3 творческую свободу"],
    "3-7": ["Создавайте совместные проекты на стыке искусства и философии", "Уважайте глубину друг друга"],
    "3-8": ["3 — лицо бренда, 8 — мозг и деньги", "Доверяйте ролям"],
    "3-9": ["Направьте талант 3 на миссию 9", "Создайте совместный творческий проект для мира"],

    "4-4": ["Сознательно вносите новизну и романтику", "Путешествуйте, пробуйте новое"],
    "4-5": ["4 — учитесь отпускать", "5 — возвращайтесь домой", "Создайте гибкий, но надёжный быт"],
    "4-6": ["Поддерживайте мечты друг друга вне семьи", "Создайте большой семейный бизнес"],
    "4-7": ["Вместе занимайтесь духовными практиками с практическим результатом"],
    "4-8": ["Объедините силы вместо конкуренции", "Создайте совместную империю"],
    "4-9": ["4 — воплощайте мечты 9 в реальность", "9 — уважайте труд 4"],

    "5-5": ["Создайте «островок безопасности»", "Договоритесь о минимальных обязательствах"],
    "5-6": ["5 — учитесь быть дома", "6 — отпускайте без страха", "Создайте яркую, но уютную семью"],
    "5-7": ["Заземляйте открытия в практической жизни", "Поддерживайте друг друга в духовных поисках"],
    "5-8": ["Доверяйте зонам компетенции", "5 — идеи, 8 — реализация и деньги"],
    "5-9": ["Найдите миссию, которая не противоречит свободе"],

    "6-6": ["Давайте друг другу свободу", "Не контролируйте из любви"],
    "6-7": ["Вместе помогайте людям практическими способами", "Создавайте пространство исцеления"],
    "6-8": ["8 — учитесь нежности", "6 — развивайте амбиции"],
    "6-9": ["Сделайте свою семью частью большой миссии", "9 — не жертвуйте близкими ради мира"],

    "7-7": ["Учитесь открывать сердце", "Создавайте физическую близость осознанно"],
    "7-8": ["Объедините мудрость 7 и силу 8", "Создайте проект, который меняет мир и приносит доход"],
    "7-9": ["Заземляйте знания в практической помощи людям"],

    "8-8": ["Объедините силы вместо войны", "Создайте совместную империю"],
    "8-9": ["Направьте силу 8 на идеалы 9", "Создайте этичную империю добра"],
    "9-9": ["Сделайте отношения частью большой миссии", "Не забывайте о личной близости"],

    "default": [
      "Развивайте взаимоуважение и признавайте сильные стороны друг друга.",
      "Используйте различия в параметрах как возможность для роста, а не как повод для конфликтов."
    ]
  }
};

export const EN_NUMEROLOGY_CONTENT: CompatibilityTexts = {
  lpAnalysis: {
    "1-1": { title: "Union of Two Leaders", strengths: "Immense energy, ambition, ability to take responsibility. Together you can build an empire.", challenges: "Power struggles, ego clashes, reluctance to yield. Without clear roles the union collapses.", focus: "Learn to divide spheres of influence and genuinely admire each other’s strengths." },
    "1-2": { title: "Union of Drive and Sensitivity", strengths: "1 brings momentum and direction, 2 offers diplomacy, support and emotional comfort.", challenges: "1 seems harsh to 2, 2 seems too hesitant to 1.", focus: "1 learns to trust 2’s intuition, 2 trusts 1’s decisiveness." },
    "1-3": { title: "Union of Creative Ambition", strengths: "Bright, charismatic couple. You easily inspire each other and the world.", challenges: "Jealousy over attention, fight for the spotlight.", focus: "Channel 3’s creativity into joint projects where 1 acts as strategist." },
    "1-4": { title: "Union of Dream and Foundation", strengths: "1 brings vision and charisma, 4 brings stability and execution.", challenges: "1 finds 4 boring, 4 finds 1 unrealistic.", focus: "Build a system where 1 generates ideas and 4 reliably implements them." },
    "1-5": { title: "Union of Free Spirits", strengths: "Freedom, adventure, constant growth. Never boring.", challenges: "Hard to build routine and long-term commitments.", focus: "Agree on minimal anchors — shared home, financial safety net." },
    "1-6": { title: "Union of Career and Family", strengths: "1 drives growth and status, 6 provides warmth and emotional foundation.", challenges: "1 is often absent, 6 feels neglected.", focus: "1 makes time for family, 6 supports 1’s ambitions without guilt." },
    "1-7": { title: "Union of Independent Minds", strengths: "Intellectual freedom, deep conversations, respect for personal space.", challenges: "Emotional distance, lack of physical warmth.", focus: "Consciously create rituals of tenderness and speak openly about feelings." },
    "1-8": { title: "Union of Power and Wealth", strengths: "Powerful business duo. 1 is the visionary, 8 the strategist and manager.", challenges: "Fierce power struggles.", focus: "Clearly divide control zones and respect each other’s strength." },
    "1-9": { title: "Union of Leadership and Humanism", strengths: "Together you can change the world through large-scale humanitarian projects.", challenges: "1 wants personal glory, 9 wants selfless service.", focus: "Direct 1’s ambition toward 9’s global goals." },

    "2-2": { title: "Union of Two Souls", strengths: "Deepest emotional bond, intuitive understanding without words.", challenges: "Hypersensitivity, tendency to take offense and withdraw.", focus: "Learn to speak feelings directly instead of accumulating resentment." },
    "2-3": { title: "Union of Sensitivity and Creativity", strengths: "Light, inspiring, romantic relationship full of beauty.", challenges: "2 needs depth, 3 can be superficial.", focus: "3 learns emotional responsibility, 2 avoids suffocating creativity with control." },
    "2-4": { title: "Union of Comfort and Reliability", strengths: "Very warm, family-oriented union. Perfect foundation for home and children.", challenges: "2 may seem too emotional to 4.", focus: "Create traditions that nourish both partners." },
    "2-5": { title: "Union of Feeling and Freedom", strengths: "2 brings depth, 5 brings brightness. Very passionate.", challenges: "2 fears abandonment, 5 fears commitment.", focus: "Find balance between freedom and closeness." },
    "2-6": { title: "Union of Two Caring Hearts", strengths: "Ideal family couple full of love and mutual support.", challenges: "Tendency to lose oneself in the partner.", focus: "Maintain personal interests and space." },
    "2-7": { title: "Union of Soul and Spirit", strengths: "Very deep spiritual connection, almost telepathic.", challenges: "Both can withdraw from reality.", focus: "Engage in spiritual practices together and help each other stay grounded." },
    "2-8": { title: "Union of Feeling and Power", strengths: "2 softens 8’s toughness, 8 protects and elevates 2.", challenges: "8 can suppress 2, 2 can manipulate with emotions.", focus: "8 learns tenderness, 2 learns confidence." },
    "2-9": { title: "Union of Love and Mission", strengths: "Beautiful, inspiring couple capable of helping thousands.", challenges: "9 often puts the world above the relationship.", focus: "2 learns to let go, 9 learns to come home." },

    "3-3": { title: "Union of Two Stars", strengths: "Bright, fun, creative. You are the center of any crowd.", challenges: "Jealousy, competition for attention, unfinished projects.", focus: "Channel energy into joint creation rather than rivalry." },
    "3-4": { title: "Union of Creativity and Order", strengths: "3 brings joy and ideas, 4 brings structure and stability.", challenges: "4 gets irritated by 3’s chaos, 3 feels suffocated.", focus: "4 provides safe framework for 3’s creativity." },
    "3-5": { title: "Union of Fun and Adventure", strengths: "The brightest, lightest couple. Constant celebration.", challenges: "Lack of depth and responsibility.", focus: "Sometimes stop and talk seriously." },
    "3-6": { title: "Union of Beauty and Harmony", strengths: "Aesthetically beautiful couple who love art and comfort.", challenges: "6 demands responsibility 3 dislikes.", focus: "3 learns to finish things for the sake of family." },
    "3-7": { title: "Union of Creativity and Wisdom", strengths: "3 brings lightness, 7 brings depth. Fascinating creative tandem.", challenges: "7 may find 3 superficial.", focus: "Create projects blending art and philosophy." },
    "3-8": { title: "Union of Show and Business", strengths: "3 is the face, 8 is the brain and money. Perfect success team.", challenges: "8 finds 3 frivolous, 3 finds 8 boring.", focus: "Trust roles: 3 — charisma, 8 — strategy." },
    "3-9": { title: "Union of Talent and Ideals", strengths: "Can create something eternal — art, movement, legacy.", challenges: "9 demands sacrifice 3 isn’t ready for.", focus: "Direct 3’s talent toward 9’s higher mission." },

    "4-4": { title: "Union of Two Foundations", strengths: "Unbreakable stability, reliability, shared long-term goals.", challenges: "Boredom, routine, lack of passion.", focus: "Consciously add novelty and romance." },
    "4-5": { title: "Union of Stability and Change", strengths: "4 provides secure base, 5 brings excitement.", challenges: "4 fears change, 5 suffocates under control.", focus: "4 learns to let go, 5 learns to return home." },
    "4-6": { title: "Union of Home and Hearth", strengths: "Classic strong family, home full of abundance.", challenges: "Risk of getting stuck in routine and forgetting personal dreams.", focus: "Support each other’s dreams beyond family." },
    "4-7": { title: "Union of Practicality and Spirituality", strengths: "4 grounds 7, 7 expands 4’s horizons.", challenges: "4 sees 7 as detached from reality.", focus: "Practice spirituality with tangible results together." },
    "4-8": { title: "Union of Two Empire Builders", strengths: "Most powerful tandem for building wealth and influence.", challenges: "Both stubborn, fight for control.", focus: "Join forces instead of competing." },
    "4-9": { title: "Union of Work and Ideals", strengths: "Can build something valuable for society — foundation, community.", challenges: "4 wants concrete results, 9 wants global vision.", focus: "4 brings 9’s dreams into reality." },

    "5-5": { title: "Union of Two Freedoms", strengths: "Maximum freedom, adventure, passion. No boundaries.", challenges: "No stability, hard to raise children or build home.", focus: "Create a small island of safety amid freedom." },
    "5-6": { title: "Union of Freedom and Family", strengths: "5 brings novelty, 6 brings warmth. Very lively family.", challenges: "5 runs from routine, 6 demands consistency.", focus: "5 learns to be home, 6 learns to let go." },
    "5-7": { title: "Union of Spiritual Travelers", strengths: "Constant growth, spiritual quests, journeys.", challenges: "May lose touch with reality.", focus: "Ground discoveries in practical life." },
    "5-8": { title: "Union of Risk and Strategy", strengths: "5 generates bold ideas, 8 monetizes them. Great business pair.", challenges: "5 hates control, 8 hates chaos.", focus: "Trust each other’s domains." },
    "5-9": { title: "Union of Freedom and Mission", strengths: "Can change the world while traveling and inspiring.", challenges: "9 demands sacrifice, 5 refuses limits.", focus: "Find a mission that doesn’t restrict freedom." },

    "6-6": { title: "Union of Perfect Family", strengths: "Maximum care, love, beauty in relationship.", challenges: "Tendency to overprotect and control out of love.", focus: "Give each other freedom while keeping closeness." },
    "6-7": { title: "Union of Soul and Spirit", strengths: "Deep spiritual and emotional bond.", challenges: "May escape reality into ideals.", focus: "Help people together in practical ways." },
    "6-8": { title: "Union of Family and Status", strengths: "Beautiful, successful, respected couple.", challenges: "8 may prioritize status over feelings.", focus: "8 learns tenderness, 6 learns ambition." },
    "6-9": { title: "Union of Love and Service", strengths: "Can create a family that helps hundreds.", challenges: "9 often sacrifices family for the world.", focus: "Make your family part of the greater mission." },

    "7-7": { title: "Union of Two Mystics", strengths: "Telepathic connection, shared spiritual insights.", challenges: "Emotional closure, loneliness together.", focus: "Learn to open the heart, not just the mind." },
    "7-8": { title: "Union of Spirit and Matter", strengths: "7 brings depth, 8 brings realization. Powerful tandem.", challenges: "7 sees 8 as materialist, 8 sees 7 as impractical.", focus: "Combine wisdom and power." },
    "7-9": { title: "Union of Two Teachers", strengths: "Can become spiritual leaders and teachers of humanity.", challenges: "Both may be too detached from earth.", focus: "Ground knowledge in practical help." },

    "8-8": { title: "Union of Two Emperors", strengths: "Tremendous energy of success and power.", challenges: "Brutal power struggle.", focus: "Unite instead of fighting." },
    "8-9": { title: "Union of Power and Wisdom", strengths: "Can build an ethical empire that serves people.", challenges: "8 wants power, 9 wants selfless service.", focus: "Direct 8’s power toward 9’s ideals." },

    "9-9": { title: "Union of Two Missions", strengths: "Enormous power to improve the world.", challenges: "May forget personal relationship for humanity.", focus: "Make your love part of the greater mission." }
  },

  destinyAnalysis: {
    "1": {
      overview: "Union Number 1 means you are both pioneers. You were born to lead, initiate, and inspire the world with your example.",
      mission: "Together you came to be leaders and trailblazers. Your task is to start new things and inspire others.",
      purpose: "Create projects, businesses, and movements that change the rules of the game.",
      summary: "You are a true power couple. Where others hesitate — you act. Just don’t compete with each other — walk side by side.",
      challenges: [
        "Tendency to compete with each other",
        "Ego can inflate to the skies",
        "Risk of burning out from endless ambition"
      ],
      advice: "Walk side by side, not in a race. Win together — and the world will fall at your feet."
    },
    "2": {
      overview: "Number 2 is the union of harmony, diplomacy, and deep emotional connection. You teach each other patience and true partnership.",
      mission: "Your joint mission is to teach the world cooperation, diplomacy, and genuine intimacy.",
      purpose: "Be a role model of perfect relationships and help people reconcile.",
      summary: "One of the most harmonious unions. You heal each other and the world with your love. Just don’t lose yourself completely in the other.",
      challenges: [
        "Risk of drowning in emotions and losing yourself",
        "Excessive dependency on each other",
        "Hard to say “no” to others"
      ],
      advice: "Love fiercely, but breathe freely. Keep your boundaries — and your harmony will last forever."
    },
    "3": {
      overview: "Number 3 is joy, creativity, and lightness. Your relationship is full of laughter, inspiration, and childlike spark.",
      mission: "You are here to bring joy, creativity, and beauty into the world.",
      purpose: "Inspire people through art, words, humor, and simply by being yourselves.",
      summary: "You are the couple that lights up any room. Your task is to never lose that spark — and share it generously.",
      challenges: [
        "Running away from serious topics and responsibility",
        "Scattering energy across a thousand ideas",
        "Fear of true emotional depth"
      ],
      advice: "The party is wonderful, but sometimes you need to turn off the music and just hold each other in silence."
    },
    "4": {
      overview: "Number 4 is foundation, stability, and long-term achievement. Your union is built on reliability and shared goals.",
      mission: "Your karmic task is to build lasting systems that serve generations.",
      purpose: "Create stable businesses, strong families, homes, and traditions that endure.",
      summary: "You can build a real empire — family, legacy, wealth. Just remember to rest and enjoy the journey.",
      challenges: [
        "Tendency to turn love into work",
        "Getting stuck in routine and control",
        "Forgetting rest and spontaneity"
      ],
      advice: "Yes, build an empire — but don’t forget to build little weekends just for the two of you."
    },
    "5": {
      overview: "Number 5 is freedom, adventure, and constant growth. Your relationship is always in motion — you never stand still.",
      mission: "You are catalysts of change and freedom. Your task is to break the old and open new paths.",
      purpose: "Travel, experiment, teach people flexibility, courage, and the art of letting go.",
      summary: "The most freedom-loving union. You never let each other stagnate. Just learn to always come back home — to each other.",
      challenges: [
        "Risk of never stopping and never building a real home",
        "Fear of commitment and “landing”",
        "May lack depth and stability"
      ],
      advice: "Freedom isn’t escape. True freedom is having a place you always want to come back to."
    },
    "6": {
      overview: "Number 6 is love, beauty, care, and service. Your relationship is a true art of being together.",
      mission: "Your mission is to heal through love, beauty, and care.",
      purpose: "Create perfect families, cozy homes, harmonious communities, and spaces of love.",
      summary: "One of the warmest and most soulful unions. You heal each other with a touch. Just don’t forget about yourself while giving everything to others.",
      challenges: [
        "Sacrificing yourself for partner and family",
        "Perfectionism in relationships",
        "Jealousy and desire to control beauty"
      ],
      advice: "Love is not a heroic deed. Sometimes it’s enough just to be — not to save."
    },
    "7": {
      overview: "Number 7 is a spiritual union, a quest for truth, and deep inner growth. You didn’t meet by chance — this is a karmic connection.",
      mission: "Together you seek and transmit higher truth.",
      purpose: "Become spiritual teachers, researchers, mystics — or simply very deep individuals.",
      summary: "You understand each other without words. Your love is quiet but incredibly powerful. Just don’t escape into illusions — stay grounded.",
      challenges: [
        "Escaping into spirituality instead of real relationship",
        "Loneliness even when together",
        "Hard to talk about daily life and money"
      ],
      advice: "You can soar in spirit through the cosmos, but don’t forget to pay rent and hug each other with your bodies."
    },
    "8": {
      overview: "Union Number 8 means your relationship is primarily focused on achieving material success, status, power, and recognition.",
      mission: "Your karmic task is to master matter and power in order to serve a greater cause.",
      purpose: "Build big business, manage resources wisely and ethically, create wealth for the future.",
      summary: "You are a bright, strong, and ambitious couple. The potential for massive joint achievements is enormous. Just remember: money and status are tools, not the goal. Don’t lose your soul in the pursuit of success.",
      challenges: [
        "Money and power can become more important than love",
        "Harshness and control instead of tenderness",
        "Risk of emotional burnout"
      ],
      advice: "An empire without love is just a pile of money. Don’t lose your soul climbing to the top."
    },
    "9": {
      overview: "Number 9 is a global mission and completion of karmic cycles. Your couple came into the world to carry wisdom and service.",
      mission: "You came to complete old cycles and serve humanity selflessly. Your love is global and unconditional.",
      purpose: "Help thousands of people, engage in philanthropy, change the world on a large scale.",
      summary: "One of the noblest unions. You are capable of changing the world. Just don’t forget your own needs and don’t sacrifice your relationship for endless service.",
      challenges: [
        "Sacrificing the relationship to “save the world”",
        "Idealism and disappointment in people",
        "Hard to live in the here and now"
      ],
      advice: "You will save the world. But first save your relationship — it is your greatest gift to humanity."
    }
  },

  cellDescriptions: {
    "1_0": "No 1s — low energy, hard to take initiative. Need to build self-confidence.",
    "1_1": "One 1 — soft leadership, prefers not to stand out.",
    "1_11": "Two 1s — good energy, confidence, natural leadership.",
    "1_111": "Three 1s — strong character, bright personality, leadership qualities.",
    "1_1111": "Four 1s — very powerful energy and charisma. Risk of ego inflation.",
    "1_11111": "Five 1s — dictatorial potential, enormous will. Must be directed toward creation.",
    "1_111111": "Six 1s — extremely rare concentration of power.",

    "2_0": "No 2s — weak intuition and energy leaks.",
    "2_1": "One 2 — intuition exists but weak.",
    "2_11": "Two 2s — good soft energy, diplomacy.",
    "2_111": "Three 2s — strong empathy and intuition.",
    "2_1111": "Four 2s — powerful harmonious energy, often healers.",
    "2_4+": "Five+ 2s — hypersensitivity, need strong boundaries.",

    "3_0": "No 3s — difficulty enjoying life, creativity dormant.",
    "3_1": "One 3 — creativity appears sporadically.",
    "3_11": "Two 3s — good creative potential, lightness, humor.",
    "3_111": "Three 3s — bright talent, charisma.",
    "3_4+": "Four+ 3s — genius but possible scattering.",

    "4_0": "No 4s — naturally weak health, need discipline and sport.",
    "4_1": "One 4 — average health, discipline required.",
    "4_11": "Two 4s — good health, stability, diligence.",
    "4_111": "Three 4s — strong body, endurance.",
    "4_4+": "Four+ 4s — iron health and work capacity.",

    "5_0": "No 5s — weak emotional intelligence, logic dominates.",
    "5_1": "One 5 — restrained emotions.",
    "5_11": "Two 5s — balance of logic and feeling.",
    "5_111": "Three 5s — strong emotions and sensuality.",
    "5_4+": "Four+ 5s — very emotional, mood swings possible.",

    "6_0": "No 6s — difficulty creating comfort and caring.",
    "6_1": "One 6 — selective caring.",
    "6_11": "Two 6s — harmonious care, love for beauty.",
    "6_111": "Three 6s — strong need to care, risk of overprotection.",
    "6_4+": "Four+ 6s — tendency to self-sacrifice.",

    "7_0": "No 7s — weak spiritual connection, possible emptiness.",
    "7_1": "One 7 — mild spiritual interest.",
    "7_11": "Two 7s — good spiritual potential.",
    "7_111": "Three 7s — strong higher connection.",
    "7_4+": "Four+ 7s — powerful spiritual energy, often loneliness.",

    "8_0": "No 8s — weak sense of duty and justice.",
    "8_1": "One 8 — sense of duty present but weak.",
    "8_11": "Two 8s — developed responsibility.",
    "8_111": "Three 8s — strong duty, leadership through service.",
    "8_4+": "Four+ 8s — heavy karmic responsibility.",

    "9_0": "No 9s — weaker intellect and memory.",
    "9_1": "One 9 — average intellect.",
    "9_11": "Two 9s — good mind and memory.",
    "9_111": "Three 9s — high intelligence, wisdom.",
    "9_4+": "Four+ 9s — genius but possible detachment from reality."
  },

  recommendations: {
    "1-1": ["Clearly divide leadership areas", "Learn to sincerely praise each other", "Launch a big joint project"],
    "1-2": ["1 — practice softness", "2 — build confidence", "Create emotional closeness rituals"],
    "1-3": ["1 — become producer of 3’s talent", "3 — respect 1’s decisions", "Channel energy into joint creation"],
    "1-4": ["1 — provide 4 with stable plans", "4 — don’t limit 1’s ambitions", "Long-term project: 1 strategy, 4 execution"],
    "1-5": ["Agree on minimal commitments", "Create a shared safe base", "Travel together"],
    "1-6": ["1 — make family time sacred", "6 — support 1’s career guilt-free"],
    "1-7": ["Create tenderness rituals", "Talk openly about feelings", "Practice spirituality together"],
    "1-8": ["Divide control zones", "Respect each other’s power", "Build one big empire together"],
    "1-9": ["Channel 1’s ambition into 9’s global goals", "9 — value 1’s personal achievements", "Create a joint humanitarian project"],

    "2-2": ["Speak feelings directly", "Don’t accumulate resentment", "Create closeness rituals"],
    "2-3": ["3 — learn emotional responsibility", "2 — don’t suffocate creativity", "Plan beautiful surprises"],
    "2-4": ["Build family traditions", "Add romance to routine"],
    "2-5": ["Balance freedom and closeness", "5 — come home", "2 — learn to trust"],
    "2-6": ["Keep personal space", "Don’t dissolve completely"],
    "2-7": ["Practice spirituality together", "Help each other stay grounded"],
    "2-8": ["8 — learn tenderness", "2 — gain confidence"],
    "2-9": ["2 — learn to let go", "9 — come home to partner"],

    "3-3": ["Channel energy into joint creation", "Stop competing for attention"],
    "3-4": ["4 — create safe structure for 3’s creativity", "3 — respect order"],
    "3-5": ["Sometimes pause and talk seriously"],
    "3-6": ["3 — learn responsibility for family", "6 — give 3 creative freedom"],
    "3-7": ["Create projects blending art and philosophy"],
    "3-8": ["3 — face of the brand, 8 — strategy and money"],
    "3-9": ["Direct 3’s talent toward 9’s mission"],

    "4-4": ["Introduce novelty and romance consciously"],
    "4-5": ["4 — learn to let go", "5 — return home"],
    "4-6": ["Support each other’s dreams beyond family"],
    "4-7": ["Practice spirituality with tangible results"],
    "4-8": ["Join forces instead of competing"],
    "4-9": ["4 — bring 9’s dreams into reality"],

    "5-5": ["Create a small island of stability"],
    "5-6": ["5 — learn to be present", "6 — learn to release"],
    "5-7": ["Ground discoveries in practical life"],
    "5-8": ["Trust each other’s domains"],
    "5-9": ["Find a mission that preserves freedom"],

    "6-6": ["Give each other freedom", "Don’t overprotect"],
    "6-7": ["Help people together in practical ways"],
    "6-8": ["8 — learn tenderness", "6 — develop ambition"],
    "6-9": ["Make your family part of the greater mission"],

    "7-7": ["Learn to open hearts", "Create conscious intimacy"],
    "7-8": ["Combine wisdom and power"],
    "7-9": ["Ground knowledge in practical help"],

    "8-8": ["Unite instead of fighting"],
    "8-9": ["Direct power toward higher ideals"],
    "9-9": ["Make your relationship part of the greater mission"],

    "default": [
      "Develop mutual respect and acknowledge each other's strengths.",
      "Use differences in parameters as an opportunity for growth, not as a reason for conflict."
    ]
  }
};

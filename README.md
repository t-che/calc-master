# CalcMaster

**CalcMaster** — это веб-приложение, предоставляющее набор удобных калькуляторов для различных задач, включая ремонт, строительство, электрику, сантехнику, кулинарию, садоводство, автомобильные расчеты и многое другое. Приложение имеет адаптивный дизайн, поддерживает светлую и темную темы, а также предоставляет удобный поиск и категоризацию калькуляторов.

---

## Оглавление

- [Особенности](#особенности)
- [Технологии](#технологии)
- [Установка](#установка)
- [Использование](#использование)
- [Структура проекта](#структура-проекта)
- [Функциональность калькуляторов](#функциональность-калькуляторов)
- [Разработка и кастомизация](#разработка-и-кастомизация)
- [Лицензия](#лицензия)
- [Контакты](#контакты)

---

## Особенности

- **Многоязычный интерфейс**: Поддержка русского языка с комментариями в коде на русском и английском.
- **Адаптивный дизайн**: Приложение корректно отображается на устройствах с разными размерами экрана (десктопы, планшеты, смартфоны).
- **Светлая и темная темы**: Пользователь может переключать тему оформления с сохранением выбора в localStorage.
- **Поиск**: Быстрый поиск калькуляторов по названию или описанию.
- **Категоризация**: Калькуляторы разделены по категориям (ремонт, строительство, электрика и др.) с отображением количества калькуляторов в каждой категории.
- **Модальное окно**: Удобный интерфейс для ввода данных и отображения результатов расчета.
- **Конвертация единиц измерения**: Поддержка автоматической конвертации единиц (длина, площадь, объем, вес, жидкости).
- **Анимации и эффекты**: Плавные переходы, эффекты наведения и анимации для улучшения пользовательского опыта.
- **Кроссбраузерность**: Совместимость с современными браузерами (Chrome, Firefox, Safari, Edge).

---

## Технологии

- **HTML5**: Для структуры приложения.
- **CSS3**: Для стилизации с использованием CSS-переменных, адаптивной верстки и анимаций.
- **JavaScript (ES6+)**: Для логики приложения, включая динамическое создание форм и обработку расчетов.
- **Flexbox и CSS Grid**: Для создания гибкой и адаптивной сетки калькуляторов.
- **LocalStorage**: Для сохранения выбранной темы.
- **Markdown**: Для документации проекта.

---

## Установка

1. **Склонируйте репозиторий**:
   ```bash
   git clone https://github.com/your-username/calc-master.git
   ```
2. **Перейдите в директорию проекта**:
   ```bash
   cd calc-master
   ```
3. **Откройте `index.html` в браузере**:
   - Вы можете просто открыть файл `index.html` в любом современном браузере.
   - Либо настройте локальный сервер (например, с помощью `Live Server` в VS Code или `http-server`).

**Примечание**: Для работы приложения не требуется установка дополнительных зависимостей, так как оно использует только ванильный JavaScript и CSS.

---

## Использование

1. **Открытие приложения**:
   - Откройте `index.html` в браузере.
   - Вы увидите главный экран с логотипом, строкой поиска, переключателем темы и списком категорий.

2. **Выбор категории**:
   - Нажмите на кнопку категории (например, "Ремонт" или "Сад") для фильтрации калькуляторов.
   - Кнопка "Все" показывает все доступные калькуляторы.

3. **Поиск калькулятора**:
   - Введите запрос в строку поиска для быстрого нахождения нужного калькулятора по названию или описанию.

4. **Использование калькулятора**:
   - Нажмите на карточку калькулятора, чтобы открыть модальное окно.
   - Введите необходимые данные в поля формы.
   - Нажмите кнопку "Рассчитать" для получения результата.

5. **Переключение темы**:
   - Используйте кнопку переключения темы (солнце/луна) в правом верхнем углу для смены светлой или темной темы.

6. **Закрытие модального окна**:
   - Нажмите на крестик в модальном окне или кликните вне окна, чтобы закрыть его.
   - Также можно использовать клавишу `Escape`.

---

## Структура проекта

```plaintext
calc-master/
├── index.html       # Основной HTML-файл
├── style.css        # Стили приложения
├── main.js          # Логика приложения
└── README.md        # Документация
```

- **`index.html`**: Содержит структуру приложения, включая шапку, категории, сетку калькуляторов, модальное окно и подвал.
- **`style.css`**: Определяет стили, включая адаптивный дизайн, темы и анимации.
- **`main.js`**: Содержит логику приложения, включая данные калькуляторов, конвертацию единиц, обработку форм и событий.

---

## Функциональность калькуляторов

Приложение включает множество калькуляторов, разделенных по категориям:

### Ремонт и отделка
- **Расчет краски**: Определяет объем краски для покраски стен с учетом площади, количества слоев и расхода.
- **Расчет обоев**: Рассчитывает количество рулонов обоев на основе размеров комнаты и параметров рулона.
- **Расчет плитки**: Вычисляет количество плитки для пола или стен с учетом запаса и ширины швов.
- **Расчет ламината**: Определяет количество упаковок ламината с учетом направления укладки и запаса.
- **Потолочная плитка**: Рассчитывает количество плиток для потолка.
- **Затирка для швов**: Определяет объем затирки для плиточных швов.
- **Расчет грунтовки**: Вычисляет количество грунтовки в зависимости от типа поверхности и расхода.
- **Расчет шпаклевки**: Определяет количество шпаклевки для стен с учетом типа и состояния поверхности.
- **Расчет плинтусов**: Рассчитывает количество плинтусов с учетом дверных проемов.
- **Расчет гипсокартона**: Определяет количество листов гипсокартона для стен или потолка.
- **Утеплитель для стен**: Рассчитывает объем утеплителя.

### Садоводство
- **Уход за газоном**: Рассчитывает график ухода за газоном, включая удобрения, стрижку и полив.

### Другое
- **Коробки для переезда**: Определяет количество коробок, скотча и пузырчатой пленки для переезда.
- **Аквариум**: Рассчитывает параметры оборудования (фильтр, нагреватель, грунт) и количество рыб для аквариума.

**Примечание**: Вы можете добавить новые калькуляторы, следуя структуре объекта `calculators` в `main.js`.

---

## Разработка и кастомизация

### Добавление нового калькулятора
1. Откройте файл `main.js`.
2. Найдите массив `calculators` и добавьте новый объект калькулятора в следующем формате:
   ```javascript
   {
       id: 'unique-id',
       title: 'Название калькулятора',
       description: 'Описание калькулятора',
       category: 'repair|construction|electricity|plumbing|cooking|garden|auto|other',
       icon: '📏',
       inputs: [
           { name: 'fieldName', label: 'Название поля', type: 'number|select', ...options },
           // Другие поля
       ],
       calculate: (inputs) => {
           // Логика расчета
           return 'Результат';
       }
   }
   ```
3. Сохраните изменения и протестируйте.

### Изменение стилей
- Все стили определены в `style.css` с использованием CSS-переменных.
- Для изменения цветовой палитры отредактируйте переменные в блоке `:root` или `[data-theme="dark"]`.
- Для изменения шрифтов измените свойство `font-family` в `body`.

### Добавление новых единиц измерения
- В `main.js` в объекте `unitConversions` добавьте новые единицы в соответствующие категории (например, `length`, `area`).
- Убедитесь, что новые единицы поддерживаются в логике калькуляторов.

---

## Лицензия

Проект распространяется под лицензией MIT. Подробности см. в файле `LICENSE`.

---

## Контакты

Если у вас есть вопросы или предложения, свяжитесь с нами:
- **Email**: support@calcmaster.com
- **GitHub Issues**: [Создать issue](https://github.com/your-username/calc-master/issues)

---

# CalcMaster (English)

**CalcMaster** is a web application that provides a collection of convenient calculators for various tasks, including home repair, construction, electrical work, plumbing, cooking, gardening, automotive calculations, and more. The application features a responsive design, supports light and dark themes, and offers a user-friendly search and categorization system for calculators.

---

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Calculator Functionality](#calculator-functionality)
- [Development and Customization](#development-and-customization)
- [License](#license)
- [Contact](#contact)

---

## Features

- **Multilingual Interface**: Supports Russian language with code comments in both Russian and English.
- **Responsive Design**: Works seamlessly across devices (desktops, tablets, smartphones).
- **Light and Dark Themes**: Users can toggle between themes, with preferences saved in localStorage.
- **Search Functionality**: Quickly find calculators by title or description.
- **Categorization**: Calculators are organized into categories (repair, construction, electrical, etc.) with counts displayed for each.
- **Modal Interface**: User-friendly modal window for inputting data and viewing results.
- **Unit Conversion**: Automatic unit conversion for length, area, volume, weight, and liquids.
- **Animations and Effects**: Smooth transitions, hover effects, and animations for an enhanced user experience.
- **Cross-Browser Compatibility**: Works in modern browsers (Chrome, Firefox, Safari, Edge).

---

## Technologies

- **HTML5**: For the application structure.
- **CSS3**: For styling with CSS variables, responsive layouts, and animations.
- **JavaScript (ES6+)**: For application logic, including dynamic form creation and calculations.
- **Flexbox and CSS Grid**: For flexible and responsive calculator grids.
- **LocalStorage**: For saving the selected theme.
- **Markdown**: For project documentation.

---

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/calc-master.git
   ```
2. **Navigate to the project directory**:
   ```bash
   cd calc-master
   ```
3. **Open `index.html` in a browser**:
   - Simply open the `index.html` file in any modern browser.
   - Alternatively, set up a local server (e.g., using `Live Server` in VS Code or `http-server`).

**Note**: No additional dependencies are required, as the application uses vanilla JavaScript and CSS.

---

## Usage

1. **Open the Application**:
   - Launch `index.html` in a browser.
   - The main screen displays the logo, search bar, theme toggle, and category list.

2. **Select a Category**:
   - Click a category button (e.g., "Repair" or "Garden") to filter calculators.
   - The "All" button displays all available calculators.

3. **Search for a Calculator**:
   - Enter a query in the search bar to quickly find a calculator by title or description.

4. **Use a Calculator**:
   - Click a calculator card to open a modal window.
   - Enter the required data in the form fields.
   - Click the "Calculate" button to view the result.

5. **Toggle Theme**:
   - Use the theme toggle button (sun/moon) in the top-right corner to switch between light and dark themes.

6. **Close the Modal**:
   - Click the close button in the modal or click outside the modal to close it.
   - Alternatively, press the `Escape` key.

---

## Project Structure

```plaintext
calc-master/
├── index.html       # Main HTML file
├── style.css        # Application styles
├── main.js          # Application logic
└── README.md        # Documentation
```

- **`index.html`**: Contains the application structure, including header, categories, calculator grid, modal, and footer.
- **`style.css`**: Defines styles, including responsive design, themes, and animations.
- **`main.js`**: Contains the application logic, including calculator data, unit conversion, form handling, and event listeners.

---

## Calculator Functionality

The application includes a variety of calculators organized by category:

### Repair and Finishing
- **Paint Calculator**: Calculates the amount of paint needed for walls based on area, layers, and consumption rate.
- **Wallpaper Calculator**: Determines the number of wallpaper rolls based on room dimensions and roll specifications.
- **Tile Calculator**: Calculates the number of tiles needed for floors or walls, including joint width and reserve.
- **Laminate Calculator**: Determines the number of laminate packs based on floor area and laying direction.
- **Ceiling Tile Calculator**: Calculates the number of ceiling tiles required.
- **Grout Calculator**: Determines the amount of grout needed for tile joints.
- **Primer Calculator**: Calculates the amount of primer needed based on surface type and consumption rate.
- **Putty Calculator**: Determines the amount of putty needed for walls based on type and surface condition.
- **Baseboard Calculator**: Calculates the number of baseboards needed, accounting for doorways.
- **Drywall Calculator**: Determines the number of drywall sheets needed for walls or ceilings.
- **Insulation Calculator**: Calculates the amount of insulation needed for walls.

### Gardening
- **Lawn Care Calculator**: Provides a lawn care schedule, including fertilizer, mowing, and watering requirements.

### Other
- **Moving Boxes Calculator**: Determines the number of boxes, tape, and bubble wrap needed for moving.
- **Aquarium Calculator**: Calculates equipment parameters (filter, heater, substrate) and fish capacity for an aquarium.

**Note**: New calculators can be added by following the structure of the `calculators` array in `main.js`.

---

## Development and Customization

### Adding a New Calculator
1. Open `main.js`.
2. Locate the `calculators` array and add a new calculator object in the following format:
   ```javascript
   {
       id: 'unique-id',
       title: 'Calculator Title',
       description: 'Calculator Description',
       category: 'repair|construction|electricity|plumbing|cooking|garden|auto|other',
       icon: '📏',
       inputs: [
           { name: 'fieldName', label: 'Field Label', type: 'number|select', ...options },
           // Other fields
       ],
       calculate: (inputs) => {
           // Calculation logic
           return 'Result';
       }
   }
   ```
3. Save changes and test.

### Modifying Styles
- All styles are defined in `style.css` using CSS variables.
- To change the color scheme, edit variables in the `:root` or `[data-theme="dark"]` blocks.
- To change fonts, modify the `font-family` property in the `body` selector.

### Adding New Units
- In `main.js`, add new units to the `unitConversions` object under the relevant category (e.g., `length`, `area`).
- Ensure new units are supported in the calculator logic.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Contact

For questions or suggestions, contact us:
- **Email**: support@calcmaster.com
- **GitHub Issues**: [Create an issue](https://github.com/your-username/calc-master/issues)
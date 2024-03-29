
# Преамбула
- *PUG* как компилятор html
- *SCSS* как препроцессор стилей + *Autoprefixer*
- *Webpack* для сборки и минификации JS (ES6+)

### Установка
- `npm i` - установка зависимостей
- `npm start` - запуск локального сервера
- `npm run build` или `gulp build` - компиляция миницированных файлов, без запуска сервера.
- `npm run test` - линтинг js и css

### Таски
- `gulp build` - сборка всего проекта, без запуска сервера
- `gulp buildAssets` - сборка минифицированных стилей и скриптов
- `gulp buildImages` - минификаций изображений и создание их webp версий
- `gulp pugToHtml` - сборка html шаблонов
- `gulp sprite` - сборка svg спрайта из иконок
- `gulp webp` - создание webp версий картинок


## Краткая инструкция по работе
- Конфигурация gulp вынесена в файл `gulp.cfg.js`
- Все gulp таски имеют 2 варианта: для разработки и для продакшена. При раработке, используется минимальное количество инструментов, для увеличения скорости компиляции. Когда разработка завершена, выполняем `gulp build` чтоб получить минифицированные и обработанные файлы.

## Структура папок
- `src/img/bg` - вся графика, используемая в вёрстке для оформления
- `src/img/content` - временные и контентные изображения, которые при интеграции потеряют актуальность
- `src/img/sprite` - папка для иконок, компилируемых в спрайт. Перед названием, рекомендуется используем префикс **icn-**

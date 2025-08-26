// Unit conversion system / Система конвертации единиц
const unitConversions = {
    // Length / Длина
    length: {
        мм: 1,
        см: 10,
        м: 1000,
        км: 1000000
    },
    // Area / Площадь
    area: {
        'мм²': 1,
        'см²': 100,
        'м²': 1000000,
        'га': 10000000000
    },
    // Volume / Объем
    volume: {
        'мм³': 1,
        'см³': 1000,
        'м³': 1000000000,
        'л': 1000000,
        'мл': 1000
    },
    // Weight / Вес
    weight: {
        мг: 1,
        г: 1000,
        кг: 1000000,
        т: 1000000000
    },
    // Liquid / Жидкость
    liquid: {
        мл: 1,
        л: 1000,
        'м³': 1000000
    }
};

// Convert units / Конвертация единиц
function convertUnit(value, fromUnit, toUnit, type) {
    if (!unitConversions[type]) return value;
    const conversions = unitConversions[type];
    if (!conversions[fromUnit] || !conversions[toUnit]) return value;
    
    // Convert to base unit then to target unit
    const baseValue = value * conversions[fromUnit];
    return baseValue / conversions[toUnit];
}

// Calculator data and logic / Данные и логика калькуляторов
const calculators = [
    // Repair and Finishing / Ремонт и отделка
    {
        id: 'paint',
        title: 'Расчет краски',
        description: 'Количество краски для покраски стен',
        category: 'repair',
        icon: '🎨',
        inputs: [
            { name: 'area', label: 'Площадь стен', type: 'number', min: 0.1, step: 0.1 },
            { name: 'areaUnit', label: 'Единица площади', type: 'select', options: [
                { value: 'м²', text: 'м²' },
                { value: 'см²', text: 'см²' }
            ]},
            { name: 'layers', label: 'Количество слоев', type: 'number', min: 1, max: 5, value: 2 },
            { name: 'consumption', label: 'Расход краски (л/м²)', type: 'number', step: 0.01, value: 0.15 },
            { name: 'resultUnit', label: 'Результат в', type: 'select', options: [
                { value: 'л', text: 'литрах' },
                { value: 'мл', text: 'миллилитрах' }
            ]}
        ],
        calculate: (inputs) => {
            const areaInM2 = convertUnit(inputs.area, inputs.areaUnit, 'м²', 'area');
            const paintLiters = areaInM2 * inputs.layers * inputs.consumption;
            const result = convertUnit(paintLiters, 'л', inputs.resultUnit, 'liquid');
            return `${result.toFixed(2)} ${inputs.resultUnit}`;
        }
    },
    {
        id: 'wallpaper',
        title: 'Расчет обоев',
        description: 'Количество рулонов обоев для комнаты',
        category: 'repair',
        icon: '🏠',
        inputs: [
            { name: 'roomLength', label: 'Длина комнаты', type: 'number', min: 0.1, step: 0.1 },
            { name: 'roomWidth', label: 'Ширина комнаты', type: 'number', min: 0.1, step: 0.1 },
            { name: 'roomHeight', label: 'Высота потолков', type: 'number', min: 0.1, step: 0.1 },
            { name: 'lengthUnit', label: 'Единица длины', type: 'select', options: [
                { value: 'м', text: 'метры' },
                { value: 'см', text: 'сантиметры' }
            ]},
            { name: 'rollWidth', label: 'Ширина рулона (м)', type: 'number', step: 0.01, value: 0.53 },
            { name: 'rollLength', label: 'Длина рулона (м)', type: 'number', value: 10 },
            { name: 'pattern', label: 'Раппорт рисунка (см)', type: 'number', min: 0, value: 0 }
        ],
        calculate: (inputs) => {
            const length = convertUnit(inputs.roomLength, inputs.lengthUnit, 'м', 'length');
            const width = convertUnit(inputs.roomWidth, inputs.lengthUnit, 'м', 'length');
            const height = convertUnit(inputs.roomHeight, inputs.lengthUnit, 'м', 'length');
            const patternM = inputs.pattern / 100;
            
            const perimeter = 2 * (length + width);
            const strips = Math.ceil(perimeter / inputs.rollWidth);
            const stripHeight = height + patternM;
            const stripsPerRoll = Math.floor(inputs.rollLength / stripHeight);
            const rolls = Math.ceil(strips / stripsPerRoll);
            
            return `${rolls} рулонов (${strips} полос)`;
        }
    },
    {
        id: 'tiles',
        title: 'Расчет плитки',
        description: 'Количество плитки для пола или стен',
        category: 'repair',
        icon: '◼',
        inputs: [
            { name: 'area', label: 'Площадь поверхности', type: 'number', min: 0.1, step: 0.1 },
            { name: 'areaUnit', label: 'Единица площади', type: 'select', options: [
                { value: 'м²', text: 'м²' },
                { value: 'см²', text: 'см²' }
            ]},
            { name: 'tileLength', label: 'Длина плитки', type: 'number', min: 1 },
            { name: 'tileWidth', label: 'Ширина плитки', type: 'number', min: 1 },
            { name: 'tileSizeUnit', label: 'Единица размера плитки', type: 'select', options: [
                { value: 'см', text: 'см' },
                { value: 'мм', text: 'мм' }
            ]},
            { name: 'jointWidth', label: 'Ширина шва (мм)', type: 'number', min: 0, value: 2 },
            { name: 'reserve', label: 'Запас (%)', type: 'number', min: 0, max: 30, value: 10 }
        ],
        calculate: (inputs) => {
            const areaM2 = convertUnit(inputs.area, inputs.areaUnit, 'м²', 'area');
            const tileLengthM = convertUnit(inputs.tileLength, inputs.tileSizeUnit, 'м', 'length');
            const tileWidthM = convertUnit(inputs.tileWidth, inputs.tileSizeUnit, 'м', 'length');
            const jointM = inputs.jointWidth / 1000;
            
            const tileAreaWithJoint = (tileLengthM + jointM) * (tileWidthM + jointM);
            const tilesNeeded = areaM2 / tileAreaWithJoint;
            const totalTiles = Math.ceil(tilesNeeded * (1 + inputs.reserve / 100));
            const boxes = Math.ceil(totalTiles / 10); // Assuming 10 tiles per box
            
            return `${totalTiles} плиток (≈${boxes} упаковок по 10 шт)`;
        }
    },
    {
        id: 'laminate',
        title: 'Расчет ламината',
        description: 'Количество упаковок ламината',
        category: 'repair',
        icon: '🪵',
        inputs: [
            { name: 'area', label: 'Площадь пола', type: 'number', min: 0.1, step: 0.1 },
            { name: 'areaUnit', label: 'Единица площади', type: 'select', options: [
                { value: 'м²', text: 'м²' },
                { value: 'см²', text: 'см²' }
            ]},
            { name: 'packArea', label: 'Площадь в упаковке (м²)', type: 'number', step: 0.01, value: 2.5 },
            { name: 'reserve', label: 'Запас (%)', type: 'number', min: 0, max: 20, value: 5 },
            { name: 'direction', label: 'Направление укладки', type: 'select', options: [
                { value: 'straight', text: 'Прямая' },
                { value: 'diagonal', text: 'Диагональная (+15% расход)' }
            ]}
        ],
        calculate: (inputs) => {
            const areaM2 = convertUnit(inputs.area, inputs.areaUnit, 'м²', 'area');
            let totalArea = areaM2 * (1 + inputs.reserve / 100);
            if (inputs.direction === 'diagonal') {
                totalArea *= 1.15;
            }
            const packs = Math.ceil(totalArea / inputs.packArea);
            const totalM2 = packs * inputs.packArea;
            
            return `${packs} упаковок (${totalM2.toFixed(2)} м²)`;
        }
    },
    {
        id: 'ceiling_tiles',
        title: 'Потолочная плитка',
        description: 'Расчет потолочной плитки',
        category: 'repair',
        icon: '⬜',
        inputs: [
            { name: 'length', label: 'Длина потолка', type: 'number', min: 0.1, step: 0.1 },
            { name: 'width', label: 'Ширина потолка', type: 'number', min: 0.1, step: 0.1 },
            { name: 'unit', label: 'Единица измерения', type: 'select', options: [
                { value: 'м', text: 'метры' },
                { value: 'см', text: 'сантиметры' }
            ]},
            { name: 'tileSize', label: 'Размер плитки (см)', type: 'number', value: 50 }
        ],
        calculate: (inputs) => {
            const lengthM = convertUnit(inputs.length, inputs.unit, 'м', 'length');
            const widthM = convertUnit(inputs.width, inputs.unit, 'м', 'length');
            const area = lengthM * widthM;
            const tileSizeM = inputs.tileSize / 100;
            const tileArea = tileSizeM * tileSizeM;
            const tiles = Math.ceil(area / tileArea);
            
            return `${tiles} плиток`;
        }
    },
    {
        id: 'grout',
        title: 'Затирка для швов',
        description: 'Расчет затирки для плитки',
        category: 'repair',
        icon: '🔲',
        inputs: [
            { name: 'area', label: 'Площадь облицовки (м²)', type: 'number', min: 0.1, step: 0.1 },
            { name: 'tileLength', label: 'Длина плитки (см)', type: 'number', min: 1 },
            { name: 'tileWidth', label: 'Ширина плитки (см)', type: 'number', min: 1 },
            { name: 'tileThickness', label: 'Толщина плитки (мм)', type: 'number', min: 1, value: 8 },
            { name: 'jointWidth', label: 'Ширина шва (мм)', type: 'number', min: 1, value: 3 }
        ],
        calculate: (inputs) => {
            const coefficient = 1.5; // Коэффициент расхода
            const grout = (inputs.area * inputs.jointWidth * inputs.tileThickness * coefficient * 
                          ((inputs.tileLength + inputs.tileWidth) / (inputs.tileLength * inputs.tileWidth))) / 10;
            
            return `${grout.toFixed(1)} кг затирки`;
        }
    },
    {
        id: 'primer',
        title: 'Расчет грунтовки',
        description: 'Количество грунтовки для стен',
        category: 'repair',
        icon: '🪣',
        inputs: [
            { name: 'area', label: 'Площадь поверхности (м²)', type: 'number', min: 0.1, step: 0.1 },
            { name: 'consumption', label: 'Расход (л/м²)', type: 'number', min: 0.05, step: 0.01, value: 0.15 },
            { name: 'layers', label: 'Количество слоев', type: 'number', min: 1, max: 3, value: 1 },
            { name: 'surface', label: 'Тип поверхности', type: 'select', options: [
                { value: 1, text: 'Штукатурка' },
                { value: 1.3, text: 'Бетон' },
                { value: 0.8, text: 'Гипсокартон' },
                { value: 1.5, text: 'Кирпич' }
            ]}
        ],
        calculate: (inputs) => {
            const primer = inputs.area * inputs.consumption * inputs.layers * inputs.surface;
            return `${primer.toFixed(1)} литров`;
        }
    },
    {
        id: 'putty',
        title: 'Расчет шпаклевки',
        description: 'Количество шпаклевки для стен',
        category: 'repair',
        icon: '🥄',
        inputs: [
            { name: 'area', label: 'Площадь стен (м²)', type: 'number', min: 0.1, step: 0.1 },
            { name: 'type', label: 'Тип шпаклевки', type: 'select', options: [
                                { value: 1, text: 'Стартовая (1 кг/м²)' },
                { value: 0.5, text: 'Финишная (0.5 кг/м²)' },
                { value: 1.5, text: 'Универсальная (1.5 кг/м²)' }
            ]},
            { name: 'layers', label: 'Количество слоев', type: 'number', min: 1, max: 3, value: 2 },
            { name: 'surface', label: 'Состояние поверхности', type: 'select', options: [
                { value: 1, text: 'Ровная' },
                { value: 1.3, text: 'Неровная' },
                { value: 1.5, text: 'Очень неровная' }
            ]}
        ],
        calculate: (inputs) => {
            const putty = inputs.area * inputs.type * inputs.layers * inputs.surface;
            const bags = Math.ceil(putty / 25); // 25 кг в мешке
            return `${putty.toFixed(1)} кг (${bags} мешков по 25 кг)`;
        }
    },
    {
        id: 'baseboard',
        title: 'Расчет плинтусов',
        description: 'Количество плинтусов для комнаты',
        category: 'repair',
        icon: '📏',
        inputs: [
            { name: 'length', label: 'Длина комнаты', type: 'number', min: 0.1, step: 0.1 },
            { name: 'width', label: 'Ширина комнаты', type: 'number', min: 0.1, step: 0.1 },
            { name: 'unit', label: 'Единица измерения', type: 'select', options: [
                { value: 'м', text: 'метры' },
                { value: 'см', text: 'сантиметры' }
            ]},
            { name: 'doorWidth', label: 'Ширина дверных проемов (м)', type: 'number', min: 0, step: 0.1, value: 0.8 },
            { name: 'doorCount', label: 'Количество дверей', type: 'number', min: 0, value: 1 },
            { name: 'baseboardLength', label: 'Длина плинтуса (м)', type: 'number', value: 2.5 }
        ],
        calculate: (inputs) => {
            const lengthM = convertUnit(inputs.length, inputs.unit, 'м', 'length');
            const widthM = convertUnit(inputs.width, inputs.unit, 'м', 'length');
            const perimeter = 2 * (lengthM + widthM);
            const doorways = inputs.doorWidth * inputs.doorCount;
            const needed = perimeter - doorways;
            const pieces = Math.ceil(needed / inputs.baseboardLength);
            
            return `${pieces} штук (${(pieces * inputs.baseboardLength).toFixed(1)} м)`;
        }
    },
    {
        id: 'drywall',
        title: 'Расчет гипсокартона',
        description: 'Листы гипсокартона для стен/потолка',
        category: 'repair',
        icon: '📋',
        inputs: [
            { name: 'area', label: 'Площадь поверхности (м²)', type: 'number', min: 0.1, step: 0.1 },
            { name: 'sheetLength', label: 'Длина листа (м)', type: 'number', value: 2.5 },
            { name: 'sheetWidth', label: 'Ширина листа (м)', type: 'number', value: 1.2 },
            { name: 'layers', label: 'Количество слоев', type: 'number', min: 1, max: 2, value: 1 },
            { name: 'waste', label: 'Отходы (%)', type: 'number', min: 5, max: 20, value: 10 }
        ],
        calculate: (inputs) => {
            const sheetArea = inputs.sheetLength * inputs.sheetWidth;
            const totalArea = inputs.area * inputs.layers * (1 + inputs.waste / 100);
            const sheets = Math.ceil(totalArea / sheetArea);
            
            return `${sheets} листов`;
        }
    },
    {
        id: 'insulation',
        title: 'Утеплитель для стен',
        description: 'Расчет утеплителя',
        category: 'repair',
        icon: '🔥',
        inputs: [
            { name: 'area', label: 'Площадь стен (м²)', type: 'number', min: 0.1, step: 0.1 },
            { name: 'thickness', label: 'Толщина утеплителя (мм)', type: 'number', min: 50, step: 50, value: 100 },
            { name: 'packVolume', label: 'Объем упаковки (м³)', type: 'number', step: 0.01, value: 0.5 },
            { name: 'density', label: 'Плотность (кг/м³)', type: 'number', value: 35 }
        ],
        calculate: (inputs) => {
            const volume = inputs.area * (inputs.thickness / 1000);
            const packs = Math.ceil(volume / inputs.packVolume);
            const weight = volume * inputs.density;
            
            return `${packs} упаковок (${volume.toFixed(2)} м³, ${weight.toFixed(0)} кг)`;
        }
    },

    // Construction Materials / Строительные материалы
    {
        id: 'bricks',
        title: 'Расчет кирпича',
        description: 'Количество кирпича для стены',
        category: 'construction',
        icon: '🧱',
        inputs: [
            { name: 'length', label: 'Длина стены', type: 'number', min: 0.1, step: 0.1 },
            { name: 'height', label: 'Высота стены', type: 'number', min: 0.1, step: 0.1 },
            { name: 'unit', label: 'Единица измерения', type: 'select', options: [
                { value: 'м', text: 'метры' },
                { value: 'см', text: 'сантиметры' }
            ]},
            { name: 'thickness', label: 'Толщина стены', type: 'select', options: [
                { value: 120, text: '0.5 кирпича (120 мм)' },
                { value: 250, text: '1 кирпич (250 мм)' },
                { value: 380, text: '1.5 кирпича (380 мм)' },
                { value: 510, text: '2 кирпича (510 мм)' },
                { value: 640, text: '2.5 кирпича (640 мм)' }
            ]},
            { name: 'brickType', label: 'Тип кирпича', type: 'select', options: [
                { value: 'single', text: 'Одинарный (250×120×65)' },
                { value: 'one_half', text: 'Полуторный (250×120×88)' },
                { value: 'double', text: 'Двойной (250×120×138)' }
            ]},
            { name: 'jointThickness', label: 'Толщина шва (мм)', type: 'number', min: 5, max: 15, value: 10 }
        ],
        calculate: (inputs) => {
            const lengthM = convertUnit(inputs.length, inputs.unit, 'м', 'length');
            const heightM = convertUnit(inputs.height, inputs.unit, 'м', 'length');
            const area = lengthM * heightM;
            
            // Количество кирпичей на 1 м² с учетом швов
            const bricksPerM2 = {
                single: { 120: 51, 250: 102, 380: 153, 510: 204, 640: 255 },
                one_half: { 120: 39, 250: 78, 380: 117, 510: 156, 640: 195 },
                double: { 120: 26, 250: 52, 380: 78, 510: 104, 640: 130 }
            };
            
            const count = Math.ceil(area * bricksPerM2[inputs.brickType][inputs.thickness] * 
                                   (1 + inputs.jointThickness / 100));
            
            // Расчет раствора
            const mortarVolume = area * (inputs.thickness / 1000) * 0.25; // ~25% от объема
            
            return `${count} кирпичей, ${mortarVolume.toFixed(2)} м³ раствора`;
        }
    },
    {
        id: 'concrete',
        title: 'Расчет бетона',
        description: 'Объем бетона для фундамента',
        category: 'construction',
        icon: '🏗️',
        inputs: [
            { name: 'type', label: 'Тип конструкции', type: 'select', options: [
                { value: 'slab', text: 'Плита' },
                { value: 'strip', text: 'Ленточный фундамент' },
                { value: 'column', text: 'Столбчатый фундамент' }
            ]},
            { name: 'length', label: 'Длина', type: 'number', min: 0.1, step: 0.1 },
            { name: 'width', label: 'Ширина', type: 'number', min: 0.1, step: 0.1 },
            { name: 'depth', label: 'Глубина/Высота', type: 'number', min: 0.1, step: 0.1 },
            { name: 'unit', label: 'Единица измерения', type: 'select', options: [
                { value: 'м', text: 'метры' },
                { value: 'см', text: 'сантиметры' }
            ]},
            { name: 'columns', label: 'Количество столбов', type: 'number', min: 1, value: 1, 
              condition: (inputs) => inputs.type === 'column' }
        ],
        calculate: (inputs) => {
            const lengthM = convertUnit(inputs.length, inputs.unit, 'м', 'length');
            const widthM = convertUnit(inputs.width, inputs.unit, 'м', 'length');
            const depthM = convertUnit(inputs.depth, inputs.unit, 'м', 'length');
            
            let volume;
            if (inputs.type === 'slab') {
                volume = lengthM * widthM * depthM;
            } else if (inputs.type === 'strip') {
                const perimeter = 2 * (lengthM + widthM);
                volume = perimeter * widthM * depthM;
            } else {
                volume = lengthM * widthM * depthM * inputs.columns;
            }
            
            // Компоненты на 1 м³ бетона М300
            const cement = volume * 350; // кг
            const sand = volume * 0.65; // м³
            const gravel = volume * 1.0; // м³
            const water = volume * 190; // л
            
            return `${volume.toFixed(2)} м³ бетона (цемент: ${cement.toFixed(0)} кг, песок: ${sand.toFixed(2)} м³, щебень: ${gravel.toFixed(2)} м³)`;
        }
    },
    {
        id: 'cement_mortar',
        title: 'Цементный раствор',
        description: 'Расчет компонентов раствора',
        category: 'construction',
        icon: '🪣',
        inputs: [
            { name: 'volume', label: 'Объем раствора', type: 'number', min: 0.01, step: 0.01 },
            { name: 'volumeUnit', label: 'Единица объема', type: 'select', options: [
                { value: 'м³', text: 'м³' },
                { value: 'л', text: 'литры' }
            ]},
            { name: 'ratio', label: 'Пропорция (цемент:песок)', type: 'select', options: [
                { value: '1:3', text: '1:3 (М200)' },
                { value: '1:4', text: '1:4 (М150)' },
                { value: '1:5', text: '1:5 (М100)' },
                { value: '1:6', text: '1:6 (М75)' }
            ]}
        ],
        calculate: (inputs) => {
            const volumeM3 = convertUnit(inputs.volume, inputs.volumeUnit, 'м³', 'volume');
            const [cementPart, sandPart] = inputs.ratio.split(':').map(Number);
            const totalParts = cementPart + sandPart;
            
            const cementVolume = volumeM3 * (cementPart / totalParts);
            const sandVolume = volumeM3 * (sandPart / totalParts);
            
            // Плотность цемента ~1400 кг/м³
            const cementKg = cementVolume * 1400;
            const cementBags = Math.ceil(cementKg / 50); // 50 кг в мешке
            
            return `Цемент: ${cementKg.toFixed(0)} кг (${cementBags} мешков), Песок: ${sandVolume.toFixed(2)} м³`;
        }
    },
    {
        id: 'reinforcement',
        title: 'Расчет арматуры',
        description: 'Арматура для железобетона',
        category: 'construction',
        icon: '🔩',
        inputs: [
            { name: 'length', label: 'Длина конструкции (м)', type: 'number', min: 0.1, step: 0.1 },
            { name: 'width', label: 'Ширина конструкции (м)', type: 'number', min: 0.1, step: 0.1 },
            { name: 'diameter', label: 'Диаметр арматуры (мм)', type: 'select', options: [
                { value: 8, text: '8 мм' },
                { value: 10, text: '10 мм' },
                { value: 12, text: '12 мм' },
                { value: 14, text: '14 мм' },
                { value: 16, text: '16 мм' }
            ]},
                        { name: 'spacing', label: 'Шаг арматуры (см)', type: 'number', min: 10, max: 30, value: 20 },
            { name: 'layers', label: 'Количество слоев', type: 'number', min: 1, max: 2, value: 2 }
        ],
        calculate: (inputs) => {
            const spacingM = inputs.spacing / 100;
            
            // Продольная арматура
            const longitudinalBars = Math.ceil(inputs.width / spacingM) + 1;
            const longitudinalLength = longitudinalBars * inputs.length * inputs.layers;
            
            // Поперечная арматура
            const transverseBars = Math.ceil(inputs.length / spacingM) + 1;
            const transverseLength = transverseBars * inputs.width * inputs.layers;
            
            const totalLength = longitudinalLength + transverseLength;
            
            // Вес арматуры (кг/м)
            const weights = { 8: 0.395, 10: 0.617, 12: 0.888, 14: 1.21, 16: 1.58 };
            const totalWeight = totalLength * weights[inputs.diameter];
            
            return `${totalLength.toFixed(1)} м (${totalWeight.toFixed(1)} кг)`;
        }
    },
    {
        id: 'foam_blocks',
        title: 'Пеноблоки',
        description: 'Расчет пеноблоков для стен',
        category: 'construction',
        icon: '⬜',
        inputs: [
            { name: 'length', label: 'Длина стены (м)', type: 'number', min: 0.1, step: 0.1 },
            { name: 'height', label: 'Высота стены (м)', type: 'number', min: 0.1, step: 0.1 },
            { name: 'thickness', label: 'Толщина стены (мм)', type: 'select', options: [
                { value: 200, text: '200 мм' },
                { value: 300, text: '300 мм' },
                { value: 400, text: '400 мм' }
            ]},
            { name: 'blockSize', label: 'Размер блока', type: 'select', options: [
                { value: '600x300x200', text: '600×300×200 мм' },
                { value: '600x400x200', text: '600×400×200 мм' },
                { value: '600x300x300', text: '600×300×300 мм' }
            ]},
            { name: 'openings', label: 'Площадь проемов (м²)', type: 'number', min: 0, value: 0 }
        ],
        calculate: (inputs) => {
            const wallArea = inputs.length * inputs.height - inputs.openings;
            const [blockLength, blockHeight, blockWidth] = inputs.blockSize.split('x').map(n => parseInt(n) / 1000);
            
            let blockArea;
            if (inputs.thickness === blockWidth * 1000) {
                blockArea = blockLength * blockHeight;
            } else {
                blockArea = blockLength * blockWidth;
            }
            
            const blocks = Math.ceil(wallArea / blockArea * 1.05); // 5% запас
            const glueKg = wallArea * 1.5; // ~1.5 кг/м² клея
            
            return `${blocks} блоков, ${glueKg.toFixed(0)} кг клея`;
        }
    },
    {
        id: 'roofing',
        title: 'Кровельные материалы',
        description: 'Расчет материалов для крыши',
        category: 'construction',
        icon: '🏠',
        inputs: [
            { name: 'roofType', label: 'Тип крыши', type: 'select', options: [
                { value: 'single', text: 'Односкатная' },
                { value: 'gable', text: 'Двускатная' },
                { value: 'hip', text: 'Вальмовая' },
                { value: 'mansard', text: 'Мансардная' }
            ]},
            { name: 'length', label: 'Длина здания (м)', type: 'number', min: 1, step: 0.1 },
            { name: 'width', label: 'Ширина здания (м)', type: 'number', min: 1, step: 0.1 },
            { name: 'angle', label: 'Угол наклона (°)', type: 'number', min: 10, max: 60, value: 30 },
            { name: 'material', label: 'Материал', type: 'select', options: [
                { value: 'metal', text: 'Металлочерепица' },
                { value: 'slate', text: 'Шифер' },
                { value: 'ondulin', text: 'Ондулин' },
                { value: 'tile', text: 'Черепица' }
            ]}
        ],
        calculate: (inputs) => {
            const angleRad = inputs.angle * Math.PI / 180;
            let roofArea;
            
            if (inputs.roofType === 'single') {
                roofArea = inputs.length * inputs.width / Math.cos(angleRad);
            } else if (inputs.roofType === 'gable') {
                roofArea = 2 * inputs.length * (inputs.width / 2) / Math.cos(angleRad);
            } else if (inputs.roofType === 'hip') {
                roofArea = (inputs.length + inputs.width) * inputs.width / Math.cos(angleRad);
            } else {
                roofArea = 2.2 * inputs.length * (inputs.width / 2) / Math.cos(angleRad);
            }
            
            const overlap = { metal: 1.1, slate: 1.15, ondulin: 1.1, tile: 1.2 };
            const totalArea = roofArea * overlap[inputs.material];
            
            return `${totalArea.toFixed(1)} м² материала`;
        }
    },
    {
        id: 'siding',
        title: 'Расчет сайдинга',
        description: 'Сайдинг для фасада',
        category: 'construction',
        icon: '🏢',
        inputs: [
            { name: 'perimeter', label: 'Периметр дома (м)', type: 'number', min: 1, step: 0.1 },
            { name: 'height', label: 'Высота стен (м)', type: 'number', min: 1, step: 0.1 },
            { name: 'openings', label: 'Площадь окон и дверей (м²)', type: 'number', min: 0, value: 0 },
            { name: 'panelLength', label: 'Длина панели (м)', type: 'number', value: 3.66 },
            { name: 'panelWidth', label: 'Ширина панели (м)', type: 'number', value: 0.23 }
        ],
        calculate: (inputs) => {
            const wallArea = inputs.perimeter * inputs.height - inputs.openings;
            const panelArea = inputs.panelLength * inputs.panelWidth;
            const panels = Math.ceil(wallArea / panelArea * 1.1); // 10% запас
            
            // Дополнительные элементы
            const corners = Math.ceil(inputs.height * 4 / 3); // Углы
            const jProfile = Math.ceil(panels / 2); // J-профиль
            
            return `${panels} панелей, ${corners} угловых элементов, ${jProfile} J-профилей`;
        }
    },
    {
        id: 'plaster',
        title: 'Штукатурка стен',
        description: 'Расчет штукатурной смеси',
        category: 'construction',
        icon: '🏗️',
        inputs: [
            { name: 'area', label: 'Площадь стен (м²)', type: 'number', min: 0.1, step: 0.1 },
            { name: 'thickness', label: 'Толщина слоя (мм)', type: 'number', min: 5, max: 50, value: 15 },
            { name: 'type', label: 'Тип штукатурки', type: 'select', options: [
                { value: 15, text: 'Гипсовая (15 кг/м²/см)' },
                { value: 17, text: 'Цементная (17 кг/м²/см)' },
                { value: 8, text: 'Декоративная (8 кг/м²/см)' }
            ]}
        ],
        calculate: (inputs) => {
            const consumption = inputs.type * (inputs.thickness / 10);
            const total = inputs.area * consumption;
            const bags = Math.ceil(total / 25); // 25 кг в мешке
            
            return `${total.toFixed(1)} кг (${bags} мешков по 25 кг)`;
        }
    },

    // Electrical / Электрика
    {
        id: 'cable',
        title: 'Сечение кабеля',
        description: 'Расчет сечения кабеля по мощности',
        category: 'electric',
        icon: '⚡',
        inputs: [
            { name: 'power', label: 'Мощность', type: 'number', min: 0.1, step: 0.1 },
            { name: 'powerUnit', label: 'Единица мощности', type: 'select', options: [
                { value: 'кВт', text: 'кВт' },
                { value: 'Вт', text: 'Вт' }
            ]},
            { name: 'voltage', label: 'Напряжение', type: 'select', options: [
                { value: 220, text: '220В (однофазное)' },
                { value: 380, text: '380В (трехфазное)' }
            ]},
            { name: 'length', label: 'Длина кабеля (м)', type: 'number', min: 1 },
            { name: 'cableType', label: 'Тип кабеля', type: 'select', options: [
                { value: 'copper', text: 'Медь' },
                { value: 'aluminum', text: 'Алюминий' }
            ]}
        ],
        calculate: (inputs) => {
            const powerW = inputs.powerUnit === 'кВт' ? inputs.power * 1000 : inputs.power;
            const current = inputs.voltage === 220 ? 
                powerW / inputs.voltage : 
                powerW / (inputs.voltage * 1.73);
            
            // Сечения для меди/алюминия
            const sections = {
                copper: [
                    { current: 16, section: 1.5 },
                    { current: 25, section: 2.5 },
                    { current: 32, section: 4 },
                    { current: 40, section: 6 },
                    { current: 55, section: 10 },
                    { current: 75, section: 16 }
                ],
                aluminum: [
                    { current: 16, section: 2.5 },
                    { current: 25, section: 4 },
                    { current: 32, section: 6 },
                    { current: 40, section: 10 },
                    { current: 55, section: 16 },
                    { current: 75, section: 25 }
                ]
            };
            
            const sectionData = sections[inputs.cableType].find(s => s.current >= current) || 
                               sections[inputs.cableType][sections[inputs.cableType].length - 1];
            
            // Потери напряжения
            const resistance = inputs.cableType === 'copper' ? 0.0175 : 0.028;
            const voltageDrop = (2 * inputs.length * current * resistance) / sectionData.section;
            const dropPercent = (voltageDrop / inputs.voltage) * 100;
            
            return `${sectionData.section} мм² (ток ${current.toFixed(1)}А, потери ${dropPercent.toFixed(1)}%)`;
        }
    },
    {
        id: 'circuit_breaker',
        title: 'Автоматический выключатель',
        description: 'Подбор автомата по мощности',
        category: 'electric',
        icon: '🔌',
        inputs: [
            { name: 'power', label: 'Суммарная мощность (кВт)', type: 'number', min: 0.1, step: 0.1 },
            { name: 'voltage', label: 'Напряжение', type: 'select', options: [
                { value: 220, text: '220В' },
                { value: 380, text: '380В' }
            ]},
            { name: 'powerFactor', label: 'Коэффициент мощности', type: 'number', min: 0.5, max: 1, step: 0.05, value: 0.95 }
        ],
        calculate: (inputs) => {
            const current = inputs.voltage === 220 ? 
                (inputs.power * 1000) / (inputs.voltage * inputs.powerFactor) : 
                (inputs.power * 1000) / (inputs.voltage * 1.73 * inputs.powerFactor);
            
            // Стандартные номиналы автоматов
            const ratings = [6, 10, 16, 20, 25, 32, 40, 50, 63, 80, 100];
            const breaker = ratings.find(r => r >= current * 1.25) || ratings[ratings.length - 1];
            
            return `Автомат ${breaker}А (расчетный ток ${current.toFixed(1)}А)`;
        }
    },
    {
        id: 'sockets',
        title: 'Количество розеток',
        description: 'Расчет розеток для помещения',
        category: 'electric',
        icon: '🔌',
        inputs: [
            { name: 'roomType', label: 'Тип помещения', type: 'select', options: [
                { value: 'living', text: 'Жилая комната' },
                { value: 'kitchen', text: 'Кухня' },
                { value: 'bedroom', text: 'Спальня' },
                { value: 'office', text: 'Кабинет' },
                { value: 'bathroom', text: 'Ванная' }
            ]},
            { name: 'area', label: 'Площадь (м²)', type: 'number', min: 1, step: 0.1 },
                        { name: 'perimeter', label: 'Периметр (м)', type: 'number', min: 1, step: 0.1 }
        ],
        calculate: (inputs) => {
            const standards = {
                living: { perM: 1, min: 4, additional: 2 },
                kitchen: { perM: 1.5, min: 6, additional: 3 },
                bedroom: { perM: 0.8, min: 3, additional: 1 },
                office: { perM: 1.2, min: 5, additional: 2 },
                bathroom: { perM: 0, min: 2, additional: 1 }
            };
            
            const standard = standards[inputs.roomType];
            const byPerimeter = Math.ceil(inputs.perimeter * standard.perM / 4); // Каждые 4м
            const recommended = Math.max(byPerimeter, standard.min) + standard.additional;
            
            return `${recommended} розеток (минимум ${standard.min})`;
        }
    },
    {
        id: 'lighting',
        title: 'Расчет освещения',
        description: 'Количество и мощность светильников',
        category: 'electric',
        icon: '💡',
        inputs: [
            { name: 'area', label: 'Площадь помещения (м²)', type: 'number', min: 1, step: 0.1 },
            { name: 'height', label: 'Высота потолков (м)', type: 'number', min: 2, max: 5, step: 0.1, value: 2.7 },
            { name: 'roomType', label: 'Тип помещения', type: 'select', options: [
                { value: 150, text: 'Спальня (150 лк)' },
                { value: 200, text: 'Гостиная (200 лк)' },
                { value: 300, text: 'Кухня (300 лк)' },
                { value: 400, text: 'Рабочий кабинет (400 лк)' },
                { value: 50, text: 'Коридор (50 лк)' }
            ]},
            { name: 'lampType', label: 'Тип ламп', type: 'select', options: [
                { value: 10, text: 'LED (10 лм/Вт)' },
                { value: 4, text: 'Лампа накаливания (4 лм/Вт)' },
                { value: 6, text: 'Галогенная (6 лм/Вт)' }
            ]}
        ],
        calculate: (inputs) => {
            const heightCoef = inputs.height <= 2.7 ? 1 : inputs.height <= 3.5 ? 1.2 : 1.5;
            const totalLumens = inputs.area * inputs.roomType * heightCoef;
            const totalWatts = totalLumens / inputs.lampType;
            
            // Расчет количества светильников
            const lampPower = inputs.lampType === 10 ? 12 : inputs.lampType === 4 ? 60 : 35;
            const lampCount = Math.ceil(totalWatts / lampPower);
            
            return `${totalLumens.toFixed(0)} лм, ${totalWatts.toFixed(0)} Вт (${lampCount} ламп по ${lampPower} Вт)`;
        }
    },
    {
        id: 'electrical_load',
        title: 'Электрическая нагрузка',
        description: 'Расчет общей нагрузки дома',
        category: 'electric',
        icon: '⚡',
        inputs: [
            { name: 'area', label: 'Площадь дома (м²)', type: 'number', min: 10, step: 1 },
            { name: 'heating', label: 'Электроотопление', type: 'select', options: [
                { value: 0, text: 'Нет' },
                { value: 100, text: 'Да (100 Вт/м²)' }
            ]},
            { name: 'waterHeater', label: 'Водонагреватель (кВт)', type: 'number', min: 0, max: 10, value: 2 },
            { name: 'kitchen', label: 'Электроплита', type: 'select', options: [
                { value: 0, text: 'Нет' },
                { value: 7, text: 'Да (7 кВт)' }
            ]}
        ],
        calculate: (inputs) => {
            // Базовая нагрузка
            const baseLoad = inputs.area * 30; // 30 Вт/м²
            const heatingLoad = inputs.area * inputs.heating;
            const totalLoad = (baseLoad + heatingLoad) / 1000 + inputs.waterHeater + inputs.kitchen;
            
            // Коэффициент одновременности
            const simultaneity = totalLoad < 10 ? 1 : totalLoad < 20 ? 0.8 : 0.65;
            const designLoad = totalLoad * simultaneity;
            
            // Ток
            const current = (designLoad * 1000) / 220;
            
            return `${totalLoad.toFixed(1)} кВт (расчетная ${designLoad.toFixed(1)} кВт, ${current.toFixed(0)}А)`;
        }
    },

    // Plumbing / Сантехника
    {
        id: 'radiators',
        title: 'Расчет радиаторов',
        description: 'Количество секций радиатора',
        category: 'plumbing',
        icon: '🔥',
        inputs: [
            { name: 'area', label: 'Площадь комнаты (м²)', type: 'number', min: 1, step: 0.1 },
            { name: 'height', label: 'Высота потолков (м)', type: 'number', min: 2, step: 0.1, value: 2.7 },
            { name: 'windows', label: 'Количество окон', type: 'number', min: 0, value: 1 },
            { name: 'outerWalls', label: 'Наружных стен', type: 'number', min: 0, max: 4, value: 1 },
            { name: 'region', label: 'Климатическая зона', type: 'select', options: [
                { value: 0.8, text: 'Южная' },
                { value: 1, text: 'Средняя полоса' },
                { value: 1.2, text: 'Северная' }
            ]},
            { name: 'sectionPower', label: 'Мощность секции (Вт)', type: 'number', value: 160 }
        ],
        calculate: (inputs) => {
            const baseHeat = 100; // Вт/м²
            const heightCoef = inputs.height / 2.7;
            const windowCoef = 1 + (inputs.windows - 1) * 0.1;
            const wallCoef = 1 + (inputs.outerWalls - 1) * 0.1;
            
            const totalPower = inputs.area * baseHeat * heightCoef * windowCoef * wallCoef * inputs.region;
            const sections = Math.ceil(totalPower / inputs.sectionPower);
            
            return `${sections} секций (${totalPower.toFixed(0)} Вт)`;
        }
    },
    {
        id: 'water_pipes',
        title: 'Водопроводные трубы',
        description: 'Диаметр труб для водоснабжения',
        category: 'plumbing',
        icon: '🚰',
        inputs: [
            { name: 'fixtures', label: 'Количество точек водоразбора', type: 'number', min: 1, max: 20 },
            { name: 'simultaneous', label: 'Одновременно используемых', type: 'number', min: 1, max: 10, value: 2 },
            { name: 'length', label: 'Длина магистрали (м)', type: 'number', min: 1 },
            { name: 'material', label: 'Материал труб', type: 'select', options: [
                { value: 'plastic', text: 'Пластик' },
                { value: 'metal', text: 'Металл' },
                { value: 'copper', text: 'Медь' }
            ]}
        ],
        calculate: (inputs) => {
            // Расход воды л/с
            const flowRates = { 1: 0.2, 2: 0.3, 3: 0.4, 4: 0.5, 5: 0.6 };
            const flow = flowRates[Math.min(inputs.simultaneous, 5)] || 0.7;
            
            // Рекомендуемые диаметры
            let diameter;
            if (flow <= 0.3) diameter = 16;
            else if (flow <= 0.5) diameter = 20;
            else if (flow <= 0.8) diameter = 25;
            else diameter = 32;
            
            // Количество труб
            const pipes = Math.ceil(inputs.length / 3); // Трубы по 3м
            
            return `Диаметр ${diameter} мм, ${pipes} труб по 3м`;
        }
    },
    {
        id: 'septic_tank',
        title: 'Объем септика',
        description: 'Расчет объема септика',
        category: 'plumbing',
        icon: '🚽',
        inputs: [
            { name: 'people', label: 'Количество жильцов', type: 'number', min: 1, max: 10 },
            { name: 'waterUsage', label: 'Расход воды на человека (л/сутки)', type: 'number', min: 100, max: 300, value: 200 },
            { name: 'days', label: 'Дней до откачки', type: 'number', min: 3, max: 14, value: 3 }
        ],
        calculate: (inputs) => {
            const dailyVolume = inputs.people * inputs.waterUsage;
            const totalVolume = dailyVolume * inputs.days / 1000; // в м³
            const recommendedVolume = Math.ceil(totalVolume * 10) / 10; // Округление до 0.1 м³
            
            return `${recommendedVolume} м³ (${dailyVolume} л/сутки)`;
        }
    },
    {
        id: 'pump_power',
        title: 'Мощность насоса',
        description: 'Подбор насоса для водоснабжения',
        category: 'plumbing',
        icon: '💧',
        inputs: [
            { name: 'depth', label: 'Глубина скважины/колодца (м)', type: 'number', min: 1 },
            { name: 'height', label: 'Высота подъема (м)', type: 'number', min: 0 },
            { name: 'distance', label: 'Расстояние до дома (м)', type: 'number', min: 0 },
            { name: 'flow', label: 'Требуемый расход (л/мин)', type: 'number', min: 10, max: 100, value: 30 }
        ],
        calculate: (inputs) => {
            // Общий напор = глубина + высота + потери (10м на 100м горизонтали) + запас
            const totalHead = inputs.depth + inputs.height + (inputs.distance / 10) + 10;
            
            // Мощность насоса (кВт) = (Q * H * ρ * g) / (3600 * η)
            // Q - расход (м³/ч), H - напор (м), η - КПД (0.6)
            const flowM3h = inputs.flow * 60 / 1000;
            const power = (flowM3h * totalHead * 1000 * 9.81) / (3600 * 0.6 * 1000);
            
            return `Напор ${totalHead.toFixed(0)} м, мощность ${power.toFixed(1)} кВт`;
        }
    },
    {
        id: 'underfloor_heating',
        title: 'Теплый пол',
        description: 'Расчет водяного теплого пола',
        category: 'plumbing',
        icon: '♨️',
        inputs: [
            { name: 'area', label: 'Площадь пола (м²)', type: 'number', min: 1, step: 0.1 },
            { name: 'heatLoss', label: 'Теплопотери (Вт/м²)', type: 'number', min: 50, max: 150, value: 100 },
            { name: 'pipeSpacing', label: 'Шаг укладки (см)', type: 'select', options: [
                { value: 10, text: '10 см' },
                { value: 15, text: '15 см' },
                { value: 20, text: '20 см' },
                { value: 25, text: '25 см' }
            ]}
        ],
        calculate: (inputs) => {
            const pipeLength = inputs.area * (100 / inputs.pipeSpacing) * 1.1; // 10% запас
            const circuits = Math.ceil(pipeLength / 100); // Макс 100м на контур
            const totalPower = inputs.area * inputs.heatLoss;
            
            return `${pipeLength.toFixed(0)} м трубы, ${circuits} контуров, ${totalPower} Вт`;
        }
    },

    // Cooking / Кулинария
    {
        id: 'portions',
        title: 'Пересчет порций',
        description: 'Пересчет ингредиентов на нужное количество порций',
        category: 'cooking',
        icon: '👨‍🍳',
        inputs: [
            { name: 'originalPortions', label: 'Исходное количество порций', type: 'number', min: 1, value: 4 },
            { name: 'newPortions', label: 'Нужное количество порций', type: 'number', min: 1 },
            { name: 'ingredient', label: 'Количество ингредиента', type: 'number', min: 0, step: 0.1 },
            { name: 'unit', label: 'Единица измерения', type: 'select', options: [
                { value: 'г', text: 'граммы' },
                { value: 'кг', text: 'килограммы' },
                { value: 'мл', text: 'миллилитры' },
                { value: 'л', text: 'литры' },
                                { value: 'шт', text: 'штуки' },
                { value: 'ст.л.', text: 'столовые ложки' },
                { value: 'ч.л.', text: 'чайные ложки' },
                { value: 'стакан', text: 'стаканы' }
            ]}
        ],
        calculate: (inputs) => {
            const ratio = inputs.newPortions / inputs.originalPortions;
            const newAmount = inputs.ingredient * ratio;
            
            // Округление в зависимости от единицы
            let result;
            if (inputs.unit === 'шт') {
                result = Math.round(newAmount);
            } else if (inputs.unit === 'ст.л.' || inputs.unit === 'ч.л.') {
                result = Math.round(newAmount * 2) / 2; // До 0.5
            } else {
                result = Math.round(newAmount * 10) / 10; // До 0.1
            }
            
            return `${result} ${inputs.unit}`;
        }
    },
    {
        id: 'calories',
        title: 'Калорийность блюда',
        description: 'Расчет калорийности на порцию',
        category: 'cooking',
        icon: '🥗',
        inputs: [
            { name: 'totalCalories', label: 'Общая калорийность (ккал)', type: 'number', min: 1 },
            { name: 'totalWeight', label: 'Общий вес блюда', type: 'number', min: 1 },
            { name: 'weightUnit', label: 'Единица веса', type: 'select', options: [
                { value: 'г', text: 'граммы' },
                { value: 'кг', text: 'килограммы' }
            ]},
            { name: 'portionWeight', label: 'Вес порции (г)', type: 'number', min: 1 },
            { name: 'portions', label: 'Количество порций', type: 'number', min: 1, value: 1 }
        ],
        calculate: (inputs) => {
            const totalWeightG = inputs.weightUnit === 'кг' ? inputs.totalWeight * 1000 : inputs.totalWeight;
            const caloriesPerGram = inputs.totalCalories / totalWeightG;
            const portionCalories = caloriesPerGram * inputs.portionWeight;
            const totalPortionCalories = portionCalories * inputs.portions;
            
            return `${Math.round(portionCalories)} ккал на порцию (всего ${Math.round(totalPortionCalories)} ккал)`;
        }
    },
    {
        id: 'baking_converter',
        title: 'Конвертер для выпечки',
        description: 'Пересчет форм для выпечки',
        category: 'cooking',
        icon: '🍰',
        inputs: [
            { name: 'originalSize', label: 'Исходный размер формы (см)', type: 'number', min: 10, max: 50 },
            { name: 'originalShape', label: 'Исходная форма', type: 'select', options: [
                { value: 'round', text: 'Круглая' },
                { value: 'square', text: 'Квадратная' },
                { value: 'rect', text: 'Прямоугольная' }
            ]},
            { name: 'newSize', label: 'Новый размер формы (см)', type: 'number', min: 10, max: 50 },
            { name: 'newShape', label: 'Новая форма', type: 'select', options: [
                { value: 'round', text: 'Круглая' },
                { value: 'square', text: 'Квадратная' },
                { value: 'rect', text: 'Прямоугольная' }
            ]}
        ],
        calculate: (inputs) => {
            let originalArea, newArea;
            
            if (inputs.originalShape === 'round') {
                originalArea = Math.PI * Math.pow(inputs.originalSize / 2, 2);
            } else if (inputs.originalShape === 'square') {
                originalArea = Math.pow(inputs.originalSize, 2);
            } else {
                originalArea = inputs.originalSize * inputs.originalSize * 0.8; // Примерно
            }
            
            if (inputs.newShape === 'round') {
                newArea = Math.PI * Math.pow(inputs.newSize / 2, 2);
            } else if (inputs.newShape === 'square') {
                newArea = Math.pow(inputs.newSize, 2);
            } else {
                newArea = inputs.newSize * inputs.newSize * 0.8;
            }
            
            const ratio = newArea / originalArea;
            const percent = Math.round((ratio - 1) * 100);
            
            return `Коэффициент ${ratio.toFixed(2)} (${percent > 0 ? '+' : ''}${percent}%)`;
        }
    },
    {
        id: 'marinade',
        title: 'Расчет маринада',
        description: 'Количество маринада для мяса/рыбы',
        category: 'cooking',
        icon: '🥩',
        inputs: [
            { name: 'weight', label: 'Вес продукта', type: 'number', min: 0.1, step: 0.1 },
            { name: 'weightUnit', label: 'Единица веса', type: 'select', options: [
                { value: 'кг', text: 'кг' },
                { value: 'г', text: 'г' }
            ]},
            { name: 'type', label: 'Тип маринада', type: 'select', options: [
                { value: 0.3, text: 'Сухой (30%)' },
                { value: 0.5, text: 'Полусухой (50%)' },
                { value: 1, text: 'Жидкий (100%)' }
            ]},
            { name: 'intensity', label: 'Интенсивность', type: 'select', options: [
                { value: 0.8, text: 'Легкий' },
                { value: 1, text: 'Средний' },
                { value: 1.3, text: 'Насыщенный' }
            ]}
        ],
        calculate: (inputs) => {
            const weightKg = inputs.weightUnit === 'г' ? inputs.weight / 1000 : inputs.weight;
            const marinadeL = weightKg * inputs.type * inputs.intensity;
            const marinadeMl = marinadeL * 1000;
            
            // Время маринования
            const timeHours = inputs.type === 0.3 ? 2 : inputs.type === 0.5 ? 4 : 8;
            
            return `${marinadeMl.toFixed(0)} мл маринада (${timeHours} часов маринования)`;
        }
    },
    {
        id: 'banquet',
        title: 'Расчет для банкета',
        description: 'Количество еды для мероприятия',
        category: 'cooking',
        icon: '🎉',
        inputs: [
            { name: 'guests', label: 'Количество гостей', type: 'number', min: 1 },
            { name: 'duration', label: 'Продолжительность (часы)', type: 'number', min: 1, max: 12, value: 4 },
            { name: 'type', label: 'Тип мероприятия', type: 'select', options: [
                { value: 'light', text: 'Фуршет' },
                { value: 'medium', text: 'Банкет' },
                { value: 'full', text: 'Свадьба' }
            ]}
        ],
        calculate: (inputs) => {
            const portions = {
                light: { salad: 150, hot: 200, snacks: 100, dessert: 100 },
                medium: { salad: 200, hot: 300, snacks: 150, dessert: 150 },
                full: { salad: 250, hot: 400, snacks: 200, dessert: 200 }
            };
            
            const p = portions[inputs.type];
            const coef = inputs.duration <= 3 ? 0.8 : inputs.duration <= 5 ? 1 : 1.2;
            
            return `Салаты: ${(p.salad * inputs.guests * coef / 1000).toFixed(1)} кг, ` +
                   `Горячее: ${(p.hot * inputs.guests * coef / 1000).toFixed(1)} кг, ` +
                   `Закуски: ${(p.snacks * inputs.guests * coef / 1000).toFixed(1)} кг, ` +
                   `Десерты: ${(p.dessert * inputs.guests * coef / 1000).toFixed(1)} кг`;
        }
    },

    // Garden / Садоводство
    {
        id: 'fertilizer',
        title: 'Расчет удобрений',
        description: 'Количество удобрений для участка',
        category: 'garden',
        icon: '🌱',
        inputs: [
            { name: 'area', label: 'Площадь участка', type: 'number', min: 0.1, step: 0.1 },
            { name: 'areaUnit', label: 'Единица площади', type: 'select', options: [
                { value: 'м²', text: 'м²' },
                { value: 'сотка', text: 'сотки' },
                { value: 'га', text: 'гектары' }
            ]},
            { name: 'fertilizer', label: 'Тип удобрения', type: 'select', options: [
                { value: 30, text: 'Азотные (30 г/м²)' },
                { value: 40, text: 'Фосфорные (40 г/м²)' },
                { value: 20, text: 'Калийные (20 г/м²)' },
                { value: 50, text: 'Комплексные (50 г/м²)' },
                { value: 5000, text: 'Органические (5 кг/м²)' }
            ]},
            { name: 'season', label: 'Сезон', type: 'select', options: [
                { value: 1, text: 'Весна' },
                { value: 0.7, text: 'Лето' },
                { value: 0.8, text: 'Осень' }
            ]}
        ],
        calculate: (inputs) => {
            let areaM2;
            if (inputs.areaUnit === 'сотка') areaM2 = inputs.area * 100;
            else if (inputs.areaUnit === 'га') areaM2 = inputs.area * 10000;
            else areaM2 = inputs.area;
            
            const amount = areaM2 * inputs.fertilizer * inputs.season;
            
            if (inputs.fertilizer === 5000) {
                return `${(amount / 1000).toFixed(1)} кг (${Math.ceil(amount / 50000)} мешков по 50 кг)`;
            } else {
                return `${(amount / 1000).toFixed(1)} кг`;
            }
        }
    },
    {
        id: 'seeds',
        title: 'Расчет семян',
        description: 'Количество семян для посева',
        category: 'garden',
        icon: '🌾',
        inputs: [
            { name: 'area', label: 'Площадь посева (м²)', type: 'number', min: 0.1, step: 0.1 },
            { name: 'crop', label: 'Культура', type: 'select', options: [
                { value: 2, text: 'Газонная трава (20 г/м²)' },
                { value: 0.3, text: 'Морковь (3 г/м²)' },
                { value: 0.5, text: 'Свекла (5 г/м²)' },
                { value: 0.2, text: 'Огурцы (2 г/м²)' },
                { value: 0.1, text: 'Томаты (1 г/м²)' },
                { value: 15, text: 'Картофель (150 г/м²)' }
            ]},
            { name: 'method', label: 'Способ посева', type: 'select', options: [
                { value: 1, text: 'Рядовой' },
                { value: 1.2, text: 'Разбросной (+20%)' },
                { value: 0.8, text: 'Точный (-20%)' }
            ]}
        ],
        calculate: (inputs) => {
            const seeds = inputs.area * inputs.crop * 10 * inputs.method; // *10 для перевода в граммы
            
            if (seeds < 100) {
                return `${seeds.toFixed(1)} г (${Math.ceil(seeds / 5)} пакетов по 5 г)`;
            } else if (seeds < 1000) {
                return `${seeds.toFixed(0)} г`;
            } else {
                return `${(seeds / 1000).toFixed(1)} кг`;
            }
        }
    },
    {
        id: 'greenhouse_film',
        title: 'Пленка для теплицы',
        description: 'Расчет пленки для теплицы',
        category: 'garden',
        icon: '🏡',
        inputs: [
            { name: 'length', label: 'Длина теплицы (м)', type: 'number', min: 1, step: 0.5 },
            { name: 'width', label: 'Ширина теплицы (м)', type: 'number', min: 1, step: 0.5 },
            { name: 'height', label: 'Высота теплицы (м)', type: 'number', min: 1.5, step: 0.1, value: 2 },
            { name: 'shape', label: 'Форма крыши', type: 'select', options: [
                { value: 'arc', text: 'Арочная' },
                { value: 'gable', text: 'Двускатная' },
                { value: 'single', text: 'Односкатная' }
            ]},
            { name: 'filmWidth', label: 'Ширина пленки (м)', type: 'number', value: 3 }
        ],
        calculate: (inputs) => {
            let area;
            if (inputs.shape === 'arc') {
                const arc = Math.PI * inputs.width / 2;
                area = (arc + inputs.height * 2) * inputs.length + inputs.width * inputs.height * 2;
                        } else if (inputs.shape === 'gable') {
                area = inputs.length * (inputs.width + inputs.height * 2) + 
                       inputs.width * inputs.height * 2 + 
                       inputs.width * inputs.height; // Фронтоны
            } else {
                area = inputs.length * (inputs.width + inputs.height) + 
                       inputs.width * inputs.height * 2;
            }
            
            area *= 1.15; // 15% на нахлест и крепление
            const strips = Math.ceil(area / (inputs.filmWidth * inputs.length));
            const totalLength = strips * inputs.length;
            
            return `${area.toFixed(1)} м² пленки (${totalLength.toFixed(1)} погонных метров)`;
        }
    },
    {
        id: 'watering_system',
        title: 'Система полива',
        description: 'Расчет системы капельного полива',
        category: 'garden',
        icon: '💧',
        inputs: [
            { name: 'beds', label: 'Количество грядок', type: 'number', min: 1 },
            { name: 'bedLength', label: 'Длина грядки (м)', type: 'number', min: 1, step: 0.5 },
            { name: 'rows', label: 'Рядов на грядке', type: 'number', min: 1, max: 4, value: 2 },
            { name: 'plantSpacing', label: 'Расстояние между растениями (см)', type: 'number', min: 10, max: 100, value: 30 }
        ],
        calculate: (inputs) => {
            const totalLength = inputs.beds * inputs.bedLength * inputs.rows;
            const drippers = Math.ceil((inputs.bedLength * 100) / inputs.plantSpacing) * inputs.rows * inputs.beds;
            const mainPipe = inputs.beds * 3; // По 3м на грядку
            
            return `Капельная лента: ${totalLength} м, Капельницы: ${drippers} шт, Магистральная труба: ${mainPipe} м`;
        }
    },
    {
        id: 'soil',
        title: 'Грунт для грядок',
        description: 'Расчет грунта для высоких грядок',
        category: 'garden',
        icon: '🌍',
        inputs: [
            { name: 'length', label: 'Длина грядки (м)', type: 'number', min: 0.5, step: 0.1 },
            { name: 'width', label: 'Ширина грядки (м)', type: 'number', min: 0.3, step: 0.1 },
            { name: 'height', label: 'Высота грядки (см)', type: 'number', min: 15, max: 80, value: 30 },
            { name: 'beds', label: 'Количество грядок', type: 'number', min: 1, value: 1 },
            { name: 'composition', label: 'Состав грунта', type: 'select', options: [
                { value: 'standard', text: 'Стандартный' },
                { value: 'light', text: 'Легкий' },
                { value: 'heavy', text: 'Тяжелый' }
            ]}
        ],
        calculate: (inputs) => {
            const volumeM3 = inputs.length * inputs.width * (inputs.height / 100) * inputs.beds;
            const volumeL = volumeM3 * 1000;
            
            let composition = '';
            if (inputs.composition === 'standard') {
                composition = ` (торф ${(volumeL * 0.3).toFixed(0)}л, компост ${(volumeL * 0.3).toFixed(0)}л, песок ${(volumeL * 0.4).toFixed(0)}л)`;
            }
            
            const bags50L = Math.ceil(volumeL / 50);
            
            return `${volumeM3.toFixed(2)} м³ (${volumeL.toFixed(0)} л, ${bags50L} мешков по 50л)${composition}`;
        }
    },

    // Auto / Автомобиль
    {
        id: 'fuel',
        title: 'Расход топлива',
        description: 'Расчет расхода топлива на поездку',
        category: 'auto',
        icon: '⛽',
        inputs: [
            { name: 'distance', label: 'Расстояние (км)', type: 'number', min: 1 },
            { name: 'consumption', label: 'Расход топлива', type: 'number', min: 1, step: 0.1 },
            { name: 'consumptionType', label: 'Тип расхода', type: 'select', options: [
                { value: 'l100', text: 'л/100км' },
                { value: 'mpg', text: 'миль/галлон' }
            ]},
            { name: 'fuelPrice', label: 'Цена топлива (руб/л)', type: 'number', min: 1, step: 0.01 },
            { name: 'passengers', label: 'Количество пассажиров', type: 'number', min: 1, max: 8, value: 1 }
        ],
        calculate: (inputs) => {
            let consumptionL100;
            if (inputs.consumptionType === 'mpg') {
                consumptionL100 = 235.214 / inputs.consumption; // Конвертация из MPG
            } else {
                consumptionL100 = inputs.consumption;
            }
            
            const fuel = (inputs.distance * consumptionL100) / 100;
            const totalCost = fuel * inputs.fuelPrice;
            const costPerPerson = totalCost / inputs.passengers;
            
            return `${fuel.toFixed(1)} л, ${totalCost.toFixed(0)} руб (${costPerPerson.toFixed(0)} руб/чел)`;
        }
    },
    {
        id: 'car_paint',
        title: 'Краска для авто',
        description: 'Расчет краски для покраски автомобиля',
        category: 'auto',
        icon: '🎨',
        inputs: [
            { name: 'parts', label: 'Детали для покраски', type: 'select', options: [
                { value: 0.5, text: 'Бампер' },
                { value: 0.8, text: 'Капот' },
                { value: 0.6, text: 'Крыло' },
                { value: 1.2, text: 'Дверь' },
                { value: 1.5, text: 'Крыша' },
                { value: 8, text: 'Весь автомобиль' }
            ]},
            { name: 'layers', label: 'Количество слоев', type: 'number', min: 2, max: 4, value: 3 },
            { name: 'paintType', label: 'Тип краски', type: 'select', options: [
                { value: 'base', text: 'База + лак' },
                { value: 'acrylic', text: 'Акрил' },
                { value: 'metallic', text: 'Металлик' }
            ]}
        ],
        calculate: (inputs) => {
            const baseConsumption = 0.25; // л/м²
            const area = inputs.parts;
            let paint = area * baseConsumption * inputs.layers;
            
            if (inputs.paintType === 'metallic') paint *= 1.2;
            
            const primer = area * 0.15;
            const clearcoat = inputs.paintType === 'base' ? area * 0.2 : 0;
            
            return `Краска: ${paint.toFixed(1)} л, Грунт: ${primer.toFixed(1)} л${clearcoat > 0 ? `, Лак: ${clearcoat.toFixed(1)} л` : ''}`;
        }
    },
    {
        id: 'antifreeze',
        title: 'Антифриз',
        description: 'Расчет антифриза для системы охлаждения',
        category: 'auto',
        icon: '❄️',
        inputs: [
            { name: 'engineVolume', label: 'Объем двигателя (л)', type: 'number', min: 0.8, max: 6, step: 0.1 },
            { name: 'systemVolume', label: 'Объем системы охлаждения (л)', type: 'number', min: 3, max: 15, value: 6 },
            { name: 'concentration', label: 'Концентрация антифриза', type: 'select', options: [
                { value: 30, text: '30% (до -15°C)' },
                { value: 40, text: '40% (до -25°C)' },
                { value: 50, text: '50% (до -35°C)' },
                { value: 60, text: '60% (до -45°C)' }
            ]}
        ],
        calculate: (inputs) => {
            const antifreeze = inputs.systemVolume * (inputs.concentration / 100);
            const water = inputs.systemVolume - antifreeze;
            
            return `Антифриз: ${antifreeze.toFixed(1)} л, Дистиллированная вода: ${water.toFixed(1)} л`;
        }
    },
    {
        id: 'oil_change',
        title: 'Моторное масло',
        description: 'Расчет масла для замены',
        category: 'auto',
        icon: '🛢️',
        inputs: [
            { name: 'engineType', label: 'Тип двигателя', type: 'select', options: [
                { value: 'small', text: 'Малолитражный (до 1.6л)' },
                { value: 'medium', text: 'Средний (1.6-2.5л)' },
                { value: 'large', text: 'Большой (более 2.5л)' },
                { value: 'diesel', text: 'Дизельный' }
            ]},
            { name: 'oilVolume', label: 'Объем масла по паспорту (л)', type: 'number', min: 2, max: 10, step: 0.1, value: 4 },
            { name: 'filterChange', label: 'Замена фильтра', type: 'select', options: [
                { value: 0.3, text: 'Да (+0.3л)' },
                { value: 0, text: 'Нет' }
            ]}
        ],
        calculate: (inputs) => {
            const totalOil = inputs.oilVolume + inputs.filterChange;
            const canisters5L = Math.ceil(totalOil / 5);
            const canisters1L = Math.ceil((totalOil % 5));
            
            return `${totalOil.toFixed(1)} л масла (${canisters5L} канистр по 5л${canisters1L > 0 ? ` + ${canisters1L}л` : ''})`;
        }
    },

    // Other / Другое
    {
        id: 'stairs',
        title: 'Расчет лестницы',
        description: 'Параметры лестницы',
        category: 'other',
        icon: '🪜',
        inputs: [
            { name: 'height', label: 'Высота подъема', type: 'number', min: 100 },
            { name: 'heightUnit', label: 'Единица высоты', type: 'select', options: [
                { value: 'мм', text: 'мм' },
                { value: 'см', text: 'см' },
                { value: 'м', text: 'м' }
            ]},
            { name: 'angle', label: 'Угол наклона (°)', type: 'number', min: 25, max: 45, value: 35 },
            { name: 'stepHeight', label: 'Высота ступени (мм)', type: 'number', min: 150, max: 200, value: 170 }
        ],
        calculate: (inputs) => {
            const heightMm = convertUnit(inputs.height, inputs.heightUnit, 'мм', 'length');
            const steps = Math.round(heightMm / inputs.stepHeight);
            const actualStepHeight = heightMm / steps;
            
            // Глубина ступени по формуле 2h + d = 600-640
            const stepDepth = 620 - 2 * actualStepHeight;
            
            // Длина лестницы
            const lengthMm = steps * stepDepth;
            const lengthM = lengthMm / 1000;
            
            return `${steps} ступеней (высота ${actualStepHeight.toFixed(0)} мм, глубина ${stepDepth.toFixed(0)} мм), длина ${lengthM.toFixed(2)} м`;
        }
    },
    {
        id: 'fence',
        title: 'Расчет забора',
        description: 'Материалы для забора',
        category: 'other',
        icon: '🚧',
        inputs: [
            { name: 'length', label: 'Длина забора (м)', type: 'number', min: 1 },
            { name: 'height', label: 'Высота забора (м)', type: 'number', min: 1, step: 0.1 },
            { name: 'type', label: 'Тип забора', type: 'select', options: [
                { value: 'proflist', text: 'Профлист' },
                { value: 'wood', text: 'Деревянный' },
                { value: 'mesh', text: 'Сетка-рабица' },
                { value: 'brick', text: 'Кирпичный' }
            ]},
            { name: 'postSpacing', label: 'Расстояние между столбами (м)', type: 'number', min: 1.5, max: 4, value: 2.5 }
        ],
        calculate: (inputs) => {
            const posts = Math.ceil(inputs.length / inputs.postSpacing) + 1;
            const area = inputs.length * inputs.height;
            
            let materials = `${posts} столбов, `;
            
            if (inputs.type === 'proflist') {
                const sheets = Math.ceil(inputs.length / 1.15); // Ширина листа 1.15м
                materials += `${sheets} листов профнастила`;
            } else if (inputs.type === 'wood') {
                const boards = Math.ceil(area * 10); // ~10 досок на м²
                materials += `${boards} досок`;
            } else if (inputs.type === 'mesh') {
                const rolls = Math.ceil(inputs.length / 10); // Рулон 10м
                materials += `${rolls} рулонов сетки (10м)`;
            } else if (inputs.type === 'brick') {
                const bricks = Math.ceil(area * 400); // ~400 кирпичей на м²
                materials += `${bricks} кирпичей`;
            }
            
            // Бетон для столбов
            const concretePerPost = 0.05; // м³ на столб
            const totalConcrete = posts * concretePerPost;
            
            return `${materials}, бетон ${totalConcrete.toFixed(2)} м³`;
        }
    },
    {
        id: 'gates',
        title: 'Расчет ворот',
        description: 'Материалы для ворот',
        category: 'other',
        icon: '🚪',
        inputs: [
            { name: 'width', label: 'Ширина проема (м)', type: 'number', min: 2, max: 6, step: 0.1 },
            { name: 'height', label: 'Высота ворот (м)', type: 'number', min: 1.5, max: 3, step: 0.1 },
            { name: 'type', label: 'Тип ворот', type: 'select', options: [
                { value: 'swing', text: 'Распашные' },
                { value: 'sliding', text: 'Откатные' },
                { value: 'sectional', text: 'Секционные' },
                { value: 'roller', text: 'Рулонные' }
            ]},
            { name: 'material', label: 'Материал', type: 'select', options: [
                { value: 'proflist', text: 'Профлист' },
                { value: 'wood', text: 'Дерево' },
                { value: 'metal', text: 'Металл' }
            ]}
        ],
        calculate: (inputs) => {
            const area = inputs.width * inputs.height;
            let result = '';
            
            if (inputs.type === 'swing') {
                const leafArea = area / 2;
                result = `2 створки по ${leafArea.toFixed(1)} м², `;
                result += `петли 4-6 шт, `;
            } else if (inputs.type === 'sliding') {
                result = `Полотно ${area.toFixed(1)} м², `;
                result += `направляющая ${(inputs.width * 1.5).toFixed(1)} м, `;
                result += `ролики 2 шт, `;
            }
            
            // Материал
            if (inputs.material === 'proflist') {
                const sheets = Math.ceil(area / (1.15 * 2)); // Лист 1.15×2м
                result += `профлист ${sheets} листов`;
            } else if (inputs.material === 'wood') {
                const boards = Math.ceil(area * 12);
                result += `доски ${boards} шт`;
            } else {
                result += `металл ${(area * 40).toFixed(0)} кг`; // ~40 кг/м²
            }
            
            return result;
        }
    },
    {
        id: 'canopy',
        title: 'Расчет навеса',
        description: 'Материалы для навеса',
        category: 'other',
        icon: '⛱️',
        inputs: [
            { name: 'length', label: 'Длина навеса (м)', type: 'number', min: 2, step: 0.5 },
            { name: 'width', label: 'Ширина навеса (м)', type: 'number', min: 2, step: 0.5 },
            { name: 'height', label: 'Высота (м)', type: 'number', min: 2, max: 4, step: 0.1, value: 2.5 },
            { name: 'roofType', label: 'Тип крыши', type: 'select', options: [
                { value: 'single', text: 'Односкатная' },
                { value: 'gable', text: 'Двускатная' },
                { value: 'arc', text: 'Арочная' }
            ]},
            { name: 'posts', label: 'Количество опор', type: 'number', min: 4, max: 12, value: 4 }
        ],
        calculate: (inputs) => {
            let roofArea = inputs.length * inputs.width;
            if (inputs.roofType === 'gable') roofArea *= 1.15;
            else if (inputs.roofType === 'arc') roofArea *= 1.25;
            
            // Профильная труба для каркаса
            const perimeter = 2 * (inputs.length + inputs.width);
            const beams = perimeter + inputs.length * 2; // Дополнительные балки
            const postsLength = inputs.posts * inputs.height;
            const totalPipe = beams + postsLength;
            
            // Кровельный материал
            const roofSheets = Math.ceil(roofArea / 2.3); // Лист ~2.3 м²
            
            return `Профтруба ${totalPipe.toFixed(1)} м, кровля ${roofSheets} листов (${roofArea.toFixed(1)} м²)`;
        }
    },
    {
        id: 'gazebo',
        title: 'Расчет беседки',
        description: 'Материалы для беседки',
        category: 'other',
        icon: '🏡',
        inputs: [
            { name: 'shape', label: 'Форма беседки', type: 'select', options: [
                { value: 'square', text: 'Квадратная' },
                { value: 'rect', text: 'Прямоугольная' },
                { value: 'hex', text: 'Шестиугольная' },
                { value: 'oct', text: 'Восьмиугольная' }
            ]},
            { name: 'size', label: 'Размер (м)', type: 'number', min: 2, max: 6, step: 0.5, value: 3 },
            { name: 'height', label: 'Высота (м)', type: 'number', min: 2, max: 3.5, step: 0.1, value: 2.5 },
            { name: 'floor', label: 'Пол', type: 'select', options: [
                { value: 'wood', text: 'Деревянный' },
                { value: 'tile', text: 'Плитка' },
                { value: 'concrete', text: 'Бетон' }
            ]}
        ],
        calculate: (inputs) => {
            let area, perimeter, posts;
            
            if (inputs.shape === 'square') {
                area = inputs.size * inputs.size;
                perimeter = 4 * inputs.size;
                posts = 4;
            } else if (inputs.shape === 'rect') {
                area = inputs.size * inputs.size * 1.5;
                perimeter = 2 * (inputs.size + inputs.size * 1.5);
                posts = 6;
            } else if (inputs.shape === 'hex') {
                area = 2.598 * inputs.size * inputs.size;
                perimeter = 6 * inputs.size;
                posts = 6;
            } else {
                area = 2.828 * inputs.size * inputs.size;
                perimeter = 8 * inputs.size * 0.765;
                posts = 8;
            }
            
            // Материалы
            const roofArea = area * 1.3; // С учетом свесов
            let floorMaterial = '';
            
            if (inputs.floor === 'wood') {
                floorMaterial = `доска ${(area * 1.1 * 100 / 15).toFixed(0)} шт`;
            } else if (inputs.floor === 'tile') {
                floorMaterial = `плитка ${Math.ceil(area * 1.1)} м²`;
            } else {
                floorMaterial = `бетон ${(area * 0.1).toFixed(1)} м³`;
            }
            
            return `Площадь ${area.toFixed(1)} м², столбы ${posts} шт, кровля ${roofArea.toFixed(1)} м², ${floorMaterial}`;
        }
    },
    {
        id: 'linear_materials',
        title: 'Погонажные изделия',
        description: 'Расчет досок, брусьев, профилей',
        category: 'other',
        icon: '📏',
        inputs: [
            { name: 'totalLength', label: 'Общая длина (м)', type: 'number', min: 0.1, step: 0.1 },
            { name: 'pieceLength', label: 'Длина одной штуки (м)', type: 'number', min: 1, max: 6, value: 3 },
            { name: 'waste', label: 'Отходы (%)', type: 'number', min: 0, max: 20, value: 5 },
            { name: 'joints', label: 'Учитывать стыки', type: 'select', options: [
                { value: 0, text: 'Нет' },
                { value: 0.1, text: 'Да (зазор 10 см)' }
            ]}
        ],
        calculate: (inputs) => {
            const totalWithWaste = inputs.totalLength * (1 + inputs.waste / 100);
            const pieces = Math.ceil(totalWithWaste / (inputs.pieceLength - inputs.joints));
            const actualLength = pieces * inputs.pieceLength;
            const realWaste = ((actualLength - inputs.totalLength) / inputs.totalLength * 100).toFixed(1);
            
            return `${pieces} штук (${actualLength.toFixed(1)} м, реальные отходы ${realWaste}%)`;
        }
    },
    {
        id: 'mosquito_net',
        title: 'Москитные сетки',
        description: 'Расчет москитных сеток',
        category: 'other',
        icon: '🦟',
        inputs: [
            { name: 'windowWidth', label: 'Ширина окна (мм)', type: 'number', min: 300, max: 3000 },
            { name: 'windowHeight', label: 'Высота окна (мм)', type: 'number', min: 300, max: 3000 },
            { name: 'quantity', label: 'Количество окон', type: 'number', min: 1, value: 1 },
            { name: 'type', label: 'Тип сетки', type: 'select', options: [
                { value: 'frame', text: 'Рамочная' },
                { value: 'roll', text: 'Рулонная' },
                { value: 'plisse', text: 'Плиссе' }
            ]}
        ],
        calculate: (inputs) => {
            const widthM = inputs.windowWidth / 1000;
            const heightM = inputs.windowHeight / 1000;
            const perimeter = 2 * (widthM + heightM);
            const area = widthM * heightM;
            
            const totalArea = area * inputs.quantity;
            const totalPerimeter = perimeter * inputs.quantity;
            
            let materials = '';
            if (inputs.type === 'frame') {
                materials = `профиль ${totalPerimeter.toFixed(1)} м, сетка ${totalArea.toFixed(1)} м², уголки ${inputs.quantity * 4} шт`;
            } else if (inputs.type === 'roll') {
                materials = `короб ${inputs.quantity} шт, сетка ${(totalArea * 1.2).toFixed(1)} м²`;
            } else {
                materials = `комплект плиссе ${inputs.quantity} шт`;
            }
            
            return materials;
        }
    },
    {
        id: 'blinds',
        title: 'Расчет жалюзи',
        description: 'Жалюзи для окон',
        category: 'other',
        icon: '🪟',
        inputs: [
            { name: 'windowWidth', label: 'Ширина окна (см)', type: 'number', min: 30, max: 300 },
            { name: 'windowHeight', label: 'Высота окна (см)', type: 'number', min: 30, max: 300 },
            { name: 'mounting', label: 'Тип крепления', type: 'select', options: [
                { value: 'inside', text: 'В проем' },
                { value: 'outside', text: 'На проем (+10 см)' },
                { value: 'ceiling', text: 'К потолку' }
            ]},
            { name: 'type', label: 'Тип жалюзи', type: 'select', options: [
                { value: 'horizontal', text: 'Горизонтальные' },
                { value: 'vertical', text: 'Вертикальные' },
                { value: 'roll', text: 'Рулонные' }
            ]}
        ],
        calculate: (inputs) => {
            let width = inputs.windowWidth;
            let height = inputs.windowHeight;
            
            if (inputs.mounting === 'outside') {
                width += 10;
                height += 10;
            }
            
            const area = (width * height) / 10000; // в м²
            
            let result = `Размер ${width}×${height} см (${area.toFixed(2)} м²)`;
            
            if (inputs.type === 'vertical') {
                const lamellas = Math.ceil(width / 8.9); // Ламель 89 мм
                result += `, ${lamellas} ламелей`;
            }
            
            return result;
        }
    },
    {
        id: 'carpet',
        title: 'Расчет ковролина',
        description: 'Ковролин для помещения',
        category: 'other',
        icon: '🟦',
        inputs: [
            { name: 'roomLength', label: 'Длина комнаты (м)', type: 'number', min: 1, step: 0.1 },
            { name: 'roomWidth', label: 'Ширина комнаты (м)', type: 'number', min: 1, step: 0.1 },
            { name: 'rollWidth', label: 'Ширина рулона (м)', type: 'select', options: [
                { value: 2, text: '2 м' },
                { value: 3, text: '3 м' },
                { value: 4, text: '4 м' },
                { value: 5, text: '5 м' }
            ]},
            { name: 'direction', label: 'Направление укладки', type: 'select', options: [
                                { value: 'optimal', text: 'Оптимальное' },
                { value: 'length', text: 'Вдоль длины' },
                { value: 'width', text: 'Вдоль ширины' }
            ]},
            { name: 'reserve', label: 'Запас (%)', type: 'number', min: 0, max: 15, value: 5 }
        ],
        calculate: (inputs) => {
            let strips, totalLength;
            
            if (inputs.direction === 'optimal') {
                // Выбираем направление с минимальными отходами
                const stripsAlongLength = Math.ceil(inputs.roomWidth / inputs.rollWidth);
                const stripsAlongWidth = Math.ceil(inputs.roomLength / inputs.rollWidth);
                
                if (stripsAlongLength * inputs.roomLength < stripsAlongWidth * inputs.roomWidth) {
                    strips = stripsAlongLength;
                    totalLength = inputs.roomLength;
                } else {
                    strips = stripsAlongWidth;
                    totalLength = inputs.roomWidth;
                }
            } else if (inputs.direction === 'length') {
                strips = Math.ceil(inputs.roomWidth / inputs.rollWidth);
                totalLength = inputs.roomLength;
            } else {
                strips = Math.ceil(inputs.roomLength / inputs.rollWidth);
                totalLength = inputs.roomWidth;
            }
            
            const carpetLength = strips * totalLength * (1 + inputs.reserve / 100);
            const area = inputs.roomLength * inputs.roomWidth;
            
            return `${carpetLength.toFixed(1)} м погонных (${strips} полос), площадь ${area.toFixed(1)} м²`;
        }
    },
    {
        id: 'linoleum',
        title: 'Расчет линолеума',
        description: 'Линолеум для помещения',
        category: 'other',
        icon: '🟫',
        inputs: [
            { name: 'roomLength', label: 'Длина комнаты (м)', type: 'number', min: 1, step: 0.1 },
            { name: 'roomWidth', label: 'Ширина комнаты (м)', type: 'number', min: 1, step: 0.1 },
            { name: 'rollWidth', label: 'Ширина рулона (м)', type: 'select', options: [
                { value: 1.5, text: '1.5 м' },
                { value: 2, text: '2 м' },
                { value: 2.5, text: '2.5 м' },
                { value: 3, text: '3 м' },
                { value: 3.5, text: '3.5 м' },
                { value: 4, text: '4 м' },
                { value: 5, text: '5 м' }
            ]},
            { name: 'pattern', label: 'Рисунок', type: 'select', options: [
                { value: 0, text: 'Без подбора' },
                { value: 0.5, text: 'С подбором (+0.5м на полосу)' }
            ]}
        ],
        calculate: (inputs) => {
            // Определяем оптимальное направление
            let strips, length, width;
            
            if (inputs.roomWidth <= inputs.rollWidth) {
                // Одна полоса на всю ширину
                strips = 1;
                length = inputs.roomLength;
                width = inputs.roomWidth;
            } else if (inputs.roomLength <= inputs.rollWidth) {
                // Одна полоса на всю длину
                strips = 1;
                length = inputs.roomWidth;
                width = inputs.roomLength;
            } else {
                // Несколько полос
                const stripsAlongLength = Math.ceil(inputs.roomWidth / inputs.rollWidth);
                const stripsAlongWidth = Math.ceil(inputs.roomLength / inputs.rollWidth);
                
                if (stripsAlongLength <= stripsAlongWidth) {
                    strips = stripsAlongLength;
                    length = inputs.roomLength;
                } else {
                    strips = stripsAlongWidth;
                    length = inputs.roomWidth;
                }
            }
            
            const totalLength = strips * (length + inputs.pattern) + 0.1; // +10см на подрезку
            const area = totalLength * inputs.rollWidth;
            
            return `${totalLength.toFixed(1)} м погонных (${strips} полос${strips > 1 ? ', будут швы' : ', без швов'}), ${area.toFixed(1)} м²`;
        }
    },
        // Additional calculators to reach 100 / Дополнительные калькуляторы до 100

    // More Repair calculators / Дополнительные калькуляторы ремонта
    {
        id: 'tile_adhesive',
        title: 'Плиточный клей',
        description: 'Расчет клея для плитки',
        category: 'repair',
        icon: '🔧',
        inputs: [
            { name: 'area', label: 'Площадь укладки (м²)', type: 'number', min: 0.1, step: 0.1 },
            { name: 'tileSize', label: 'Размер плитки', type: 'select', options: [
                { value: 3, text: 'До 10×10 см (3 мм)' },
                { value: 4, text: '10×10 - 20×20 см (4 мм)' },
                { value: 5, text: '20×20 - 30×30 см (5 мм)' },
                { value: 6, text: '30×30 - 40×40 см (6 мм)' },
                { value: 8, text: 'Более 40×40 см (8 мм)' }
            ]},
            { name: 'surface', label: 'Тип поверхности', type: 'select', options: [
                { value: 1, text: 'Ровная' },
                { value: 1.2, text: 'Неровная (+20%)' }
            ]}
        ],
        calculate: (inputs) => {
            const consumption = 1.5; // кг/м²/мм
            const adhesive = inputs.area * inputs.tileSize * consumption * inputs.surface;
            const bags = Math.ceil(adhesive / 25);
            
            return `${adhesive.toFixed(1)} кг (${bags} мешков по 25 кг)`;
        }
    },
    {
        id: 'floor_leveling',
        title: 'Наливной пол',
        description: 'Расчет смеси для выравнивания',
        category: 'repair',
        icon: '🏗️',
        inputs: [
            { name: 'area', label: 'Площадь пола (м²)', type: 'number', min: 0.1, step: 0.1 },
            { name: 'thickness', label: 'Толщина слоя (мм)', type: 'number', min: 1, max: 100, value: 5 },
            { name: 'type', label: 'Тип смеси', type: 'select', options: [
                { value: 1.5, text: 'Базовая (1.5 кг/м²/мм)' },
                { value: 1.7, text: 'Финишная (1.7 кг/м²/мм)' },
                { value: 2, text: 'Толстослойная (2 кг/м²/мм)' }
            ]}
        ],
        calculate: (inputs) => {
            const mixture = inputs.area * inputs.thickness * inputs.type;
            const bags = Math.ceil(mixture / 25);
            const water = mixture * 0.2; // ~20% воды
            
            return `${mixture.toFixed(1)} кг смеси (${bags} мешков), ${water.toFixed(1)} л воды`;
        }
    },
    {
        id: 'window_slopes',
        title: 'Откосы для окон',
        description: 'Материалы для откосов',
        category: 'repair',
        icon: '🪟',
        inputs: [
            { name: 'windows', label: 'Количество окон', type: 'number', min: 1 },
            { name: 'width', label: 'Ширина окна (м)', type: 'number', min: 0.5, max: 3, step: 0.1 },
            { name: 'height', label: 'Высота окна (м)', type: 'number', min: 0.5, max: 3, step: 0.1 },
            { name: 'depth', label: 'Глубина откоса (см)', type: 'number', min: 10, max: 50, value: 20 },
            { name: 'material', label: 'Материал', type: 'select', options: [
                { value: 'plaster', text: 'Штукатурка' },
                { value: 'drywall', text: 'Гипсокартон' },
                { value: 'plastic', text: 'Пластик' }
            ]}
        ],
        calculate: (inputs) => {
            const perimeter = 2 * (inputs.width + inputs.height);
            const area = perimeter * (inputs.depth / 100) * inputs.windows;
            
            let result = '';
            if (inputs.material === 'plaster') {
                const plaster = area * 15; // 15 кг/м²
                result = `${plaster.toFixed(1)} кг штукатурки`;
            } else if (inputs.material === 'drywall') {
                const sheets = Math.ceil(area / 3); // лист 3 м²
                result = `${sheets} листов гипсокартона`;
            } else {
                const panels = Math.ceil(perimeter * inputs.windows / 3); // панель 3м
                result = `${panels} панелей по 3м`;
            }
            
            return result + `, площадь ${area.toFixed(2)} м²`;
        }
    },
    {
        id: 'door_trim',
        title: 'Наличники для дверей',
        description: 'Расчет наличников',
        category: 'repair',
        icon: '🚪',
        inputs: [
            { name: 'doors', label: 'Количество дверей', type: 'number', min: 1 },
            { name: 'doorWidth', label: 'Ширина дверного проема (см)', type: 'number', min: 60, max: 120, value: 80 },
            { name: 'doorHeight', label: 'Высота дверного проема (см)', type: 'number', min: 190, max: 230, value: 200 },
            { name: 'trimWidth', label: 'Ширина наличника (мм)', type: 'number', min: 50, max: 100, value: 70 },
            { name: 'sides', label: 'Установка', type: 'select', options: [
                { value: 1, text: 'С одной стороны' },
                { value: 2, text: 'С двух сторон' }
            ]}
        ],
        calculate: (inputs) => {
            const perimeterM = (inputs.doorWidth * 2 + inputs.doorHeight) / 100;
            const totalLength = perimeterM * inputs.doors * inputs.sides;
            const pieces = Math.ceil(totalLength / 2.2); // стандарт 2.2м
            
            return `${pieces} планок по 2.2м (${totalLength.toFixed(1)} м)`;
        }
    },

    // More Construction calculators / Дополнительные строительные калькуляторы
    {
        id: 'foundation_blocks',
        title: 'Блоки ФБС',
        description: 'Фундаментные блоки',
        category: 'construction',
        icon: '🧱',
        inputs: [
            { name: 'perimeter', label: 'Периметр фундамента (м)', type: 'number', min: 1 },
            { name: 'height', label: 'Высота фундамента (м)', type: 'number', min: 0.3, max: 3, step: 0.1 },
            { name: 'blockSize', label: 'Размер блока', type: 'select', options: [
                { value: '2400x600x600', text: 'ФБС 24-6-6 (2400×600×600)' },
                { value: '1200x600x600', text: 'ФБС 12-6-6 (1200×600×600)' },
                { value: '900x600x600', text: 'ФБС 9-6-6 (900×600×600)' }
            ]},
            { name: 'openings', label: 'Проемы (м²)', type: 'number', min: 0, value: 0 }
        ],
        calculate: (inputs) => {
            const wallArea = inputs.perimeter * inputs.height - inputs.openings;
            const [length, height] = inputs.blockSize.split('x').map(n => parseInt(n) / 1000);
            const blockArea = length * height;
            const blocks = Math.ceil(wallArea / blockArea);
            
            // Вес блоков
            const weights = { '2400x600x600': 1960, '1200x600x600': 960, '900x600x600': 700 };
            const totalWeight = (blocks * weights[inputs.blockSize]) / 1000;
            
            return `${blocks} блоков (${totalWeight.toFixed(1)} тонн)`;
        }
    },
    {
        id: 'scaffolding',
        title: 'Строительные леса',
        description: 'Расчет лесов для фасада',
        category: 'construction',
        icon: '🏗️',
        inputs: [
            { name: 'length', label: 'Длина фасада (м)', type: 'number', min: 1 },
            { name: 'height', label: 'Высота работ (м)', type: 'number', min: 2, max: 20 },
            { name: 'type', label: 'Тип лесов', type: 'select', options: [
                { value: 'frame', text: 'Рамные' },
                { value: 'wedge', text: 'Клиновые' },
                { value: 'cup', text: 'Чашечные' }
            ]}
        ],
        calculate: (inputs) => {
            const sections = Math.ceil(inputs.length / 3); // секция 3м
            const tiers = Math.ceil(inputs.height / 2); // ярус 2м
            const frames = sections * tiers * 2; // 2 рамы на ячейку
            const decks = sections * tiers;
            const diagonals = sections * tiers;
            
            return `Секций: ${sections}, ярусов: ${tiers}, рам: ${frames}, настилов: ${decks}`;
        }
    },
    {
        id: 'concrete_rings',
        title: 'Кольца для колодца',
        description: 'Ж/Б кольца для колодца',
        category: 'construction',
        icon: '⭕',
        inputs: [
            { name: 'depth', label: 'Глубина колодца (м)', type: 'number', min: 1, max: 20 },
            { name: 'diameter', label: 'Диаметр кольца', type: 'select', options: [
                { value: '1.0', text: 'КС 10-9 (Ø1м, высота 0.9м)' },
                { value: '1.5', text: 'КС 15-9 (Ø1.5м, высота 0.9м)' },
                { value: '2.0', text: 'КС 20-9 (Ø2м, высота 0.9м)' }
            ]},
            { name: 'bottom', label: 'Дно колодца', type: 'select', options: [
                { value: 'yes', text: 'С дном' },
                { value: 'no', text: 'Без дна' }
            ]}
        ],
        calculate: (inputs) => {
            const ringHeight = 0.9; // стандартная высота
            const rings = Math.ceil(inputs.depth / ringHeight);
            const covers = 1; // крышка
            const bottoms = inputs.bottom === 'yes' ? 1 : 0;
            
            // Объем грунта
            const radius = parseFloat(inputs.diameter) / 2;
            const volume = Math.PI * radius * radius * inputs.depth;
            
            return `Кольца: ${rings} шт, крышка: ${covers} шт${bottoms ? ', дно: 1 шт' : ''}, выемка грунта: ${volume.toFixed(1)} м³`;
        }
    },

    // More Electrical calculators / Дополнительные электрические калькуляторы
    {
        id: 'wire_tray',
        title: 'Кабельный лоток',
        description: 'Расчет кабельных лотков',
        category: 'electric',
        icon: '🔌',
        inputs: [
            { name: 'length', label: 'Длина трассы (м)', type: 'number', min: 1 },
            { name: 'cables', label: 'Количество кабелей', type: 'number', min: 1 },
            { name: 'cableDiameter', label: 'Средний диаметр кабеля (мм)', type: 'number', min: 5, max: 50, value: 10 },
            { name: 'reserve', label: 'Запас места (%)', type: 'number', min: 20, max: 100, value: 40 }
        ],
        calculate: (inputs) => {
            const cableArea = Math.PI * Math.pow(inputs.cableDiameter / 2, 2) * inputs.cables;
            const trayArea = cableArea * (1 + inputs.reserve / 100);
            const trayWidth = Math.ceil(Math.sqrt(trayArea) / 50) * 50; // округление до 50мм
            
            const trayPieces = Math.ceil(inputs.length / 3); // лотки по 3м
            const connectors = trayPieces - 1;
            const brackets = Math.ceil(inputs.length / 1.5); // крепеж каждые 1.5м
            
            return `Лоток ${trayWidth}мм: ${trayPieces} шт по 3м, соединители: ${connectors} шт, крепеж: ${brackets} шт`;
        }
    },
    {
        id: 'grounding',
        title: 'Заземление',
        description: 'Расчет контура заземления',
        category: 'electric',
        icon: '⚡',
        inputs: [
            { name: 'soilType', label: 'Тип грунта', type: 'select', options: [
                { value: 20, text: 'Чернозем (20 Ом·м)' },
                { value: 40, text: 'Глина (40 Ом·м)' },
                                { value: 100, text: 'Суглинок (100 Ом·м)' },
                { value: 200, text: 'Песок влажный (200 Ом·м)' },
                { value: 500, text: 'Песок сухой (500 Ом·м)' }
            ]},
            { name: 'resistance', label: 'Требуемое сопротивление (Ом)', type: 'number', min: 1, max: 30, value: 4 },
            { name: 'electrodeLength', label: 'Длина электрода (м)', type: 'number', min: 1.5, max: 3, value: 2.5 }
        ],
        calculate: (inputs) => {
            // Упрощенный расчет количества электродов
            const singleResistance = 0.366 * inputs.soilType * Math.log(2 * inputs.electrodeLength / 0.02) / inputs.electrodeLength;
            const electrodes = Math.ceil(singleResistance / inputs.resistance);
            
            // Материалы
            const electrodeTotal = electrodes * inputs.electrodeLength;
            const wire = electrodes * 3; // соединительный провод
            
            return `Электроды: ${electrodes} шт по ${inputs.electrodeLength}м, провод: ${wire}м, сопротивление ~${inputs.resistance} Ом`;
        }
    },

    // More Plumbing calculators / Дополнительные сантехнические калькуляторы
    {
        id: 'pipe_insulation',
        title: 'Утепление труб',
        description: 'Теплоизоляция для труб',
        category: 'plumbing',
        icon: '🔧',
        inputs: [
            { name: 'length', label: 'Длина труб (м)', type: 'number', min: 0.1 },
            { name: 'diameter', label: 'Диаметр трубы (мм)', type: 'select', options: [
                { value: 16, text: '16 мм' },
                { value: 20, text: '20 мм' },
                { value: 25, text: '25 мм' },
                { value: 32, text: '32 мм' },
                { value: 40, text: '40 мм' },
                { value: 50, text: '50 мм' }
            ]},
            { name: 'thickness', label: 'Толщина изоляции (мм)', type: 'select', options: [
                { value: 9, text: '9 мм' },
                { value: 13, text: '13 мм' },
                { value: 20, text: '20 мм' },
                { value: 25, text: '25 мм' }
            ]},
            { name: 'type', label: 'Тип изоляции', type: 'select', options: [
                { value: 'tube', text: 'Трубки (2м)' },
                { value: 'roll', text: 'Рулон' }
            ]}
        ],
        calculate: (inputs) => {
            if (inputs.type === 'tube') {
                const tubes = Math.ceil(inputs.length / 2);
                return `${tubes} трубок по 2м`;
            } else {
                const circumference = Math.PI * (inputs.diameter + 2 * inputs.thickness) / 1000;
                const area = inputs.length * circumference;
                return `${area.toFixed(2)} м² рулонной изоляции`;
            }
        }
    },
    {
        id: 'water_tank',
        title: 'Расширительный бак',
        description: 'Объем расширительного бака',
        category: 'plumbing',
        icon: '💧',
        inputs: [
            { name: 'systemVolume', label: 'Объем системы (л)', type: 'number', min: 10 },
            { name: 'systemType', label: 'Тип системы', type: 'select', options: [
                { value: 'heating', text: 'Отопление' },
                { value: 'water', text: 'Водоснабжение' }
            ]},
            { name: 'maxTemp', label: 'Макс. температура (°C)', type: 'number', min: 30, max: 95, value: 80 },
            { name: 'pressure', label: 'Давление в системе (бар)', type: 'number', min: 1, max: 6, value: 3 }
        ],
        calculate: (inputs) => {
            let expansionCoef;
            if (inputs.systemType === 'heating') {
                // Коэффициент расширения воды при нагреве
                expansionCoef = inputs.maxTemp <= 60 ? 0.02 : inputs.maxTemp <= 80 ? 0.03 : 0.04;
            } else {
                expansionCoef = 0.02; // Для водоснабжения
            }
            
            const efficiency = 0.5; // КПД бака
            const tankVolume = (inputs.systemVolume * expansionCoef) / efficiency;
            
            // Стандартные размеры
            const standardSizes = [8, 12, 18, 24, 35, 50, 80, 100, 150, 200];
            const recommendedSize = standardSizes.find(size => size >= tankVolume) || standardSizes[standardSizes.length - 1];
            
            return `Расчетный объем: ${tankVolume.toFixed(1)} л, рекомендуемый: ${recommendedSize} л`;
        }
    },

    // More Cooking calculators / Дополнительные кулинарные калькуляторы
    {
        id: 'yeast_converter',
        title: 'Пересчет дрожжей',
        description: 'Конвертер типов дрожжей',
        category: 'cooking',
        icon: '🍞',
        inputs: [
            { name: 'amount', label: 'Количество', type: 'number', min: 0.1, step: 0.1 },
            { name: 'fromType', label: 'Исходный тип', type: 'select', options: [
                { value: 'fresh', text: 'Свежие' },
                { value: 'dry', text: 'Сухие' },
                { value: 'instant', text: 'Быстродействующие' }
            ]},
            { name: 'toType', label: 'Нужный тип', type: 'select', options: [
                { value: 'fresh', text: 'Свежие' },
                { value: 'dry', text: 'Сухие' },
                { value: 'instant', text: 'Быстродействующие' }
            ]},
            { name: 'unit', label: 'Единица измерения', type: 'select', options: [
                { value: 'г', text: 'граммы' },
                { value: 'ч.л.', text: 'чайные ложки' }
            ]}
        ],
        calculate: (inputs) => {
            // Коэффициенты пересчета (базовая единица - свежие дрожжи)
            const ratios = {
                'fresh': 1,
                'dry': 0.33,
                'instant': 0.25
            };
            
            let amountInGrams = inputs.amount;
            if (inputs.unit === 'ч.л.') {
                // 1 ч.л. сухих дрожжей ≈ 3г, свежих ≈ 10г
                amountInGrams = inputs.fromType === 'fresh' ? inputs.amount * 10 : inputs.amount * 3;
            }
            
            const freshEquivalent = amountInGrams / ratios[inputs.fromType];
            const result = freshEquivalent * ratios[inputs.toType];
            
            let resultUnit = 'г';
            let resultAmount = result;
            
            if (inputs.unit === 'ч.л.' && inputs.toType !== 'fresh') {
                resultAmount = result / 3;
                resultUnit = 'ч.л.';
            }
            
            return `${resultAmount.toFixed(1)} ${resultUnit}`;
        }
    },
    {
        id: 'sugar_syrup',
        title: 'Сахарный сироп',
        description: 'Расчет сиропа разной концентрации',
        category: 'cooking',
        icon: '🍯',
        inputs: [
            { name: 'volume', label: 'Объем сиропа (мл)', type: 'number', min: 10 },
            { name: 'concentration', label: 'Концентрация', type: 'select', options: [
                { value: 0.3, text: 'Легкий (30%)' },
                { value: 0.5, text: 'Средний (50%)' },
                { value: 0.65, text: 'Густой (65%)' },
                { value: 0.85, text: 'Очень густой (85%)' }
            ]},
            { name: 'purpose', label: 'Назначение', type: 'select', options: [
                { value: 'drink', text: 'Для напитков' },
                { value: 'baking', text: 'Для выпечки' },
                { value: 'preserve', text: 'Для консервации' }
            ]}
        ],
        calculate: (inputs) => {
            const sugar = inputs.volume * inputs.concentration;
            const water = inputs.volume - sugar;
            
            // Время варки
            const cookTime = inputs.concentration <= 0.3 ? 5 : 
                           inputs.concentration <= 0.5 ? 10 : 
                           inputs.concentration <= 0.65 ? 15 : 20;
            
            return `Сахар: ${sugar.toFixed(0)} г, вода: ${water.toFixed(0)} мл, варить ${cookTime} мин`;
        }
    },

    // More Garden calculators / Дополнительные садовые калькуляторы
    {
        id: 'compost',
        title: 'Компостная куча',
        description: 'Расчет компостера',
        category: 'garden',
        icon: '♻️',
        inputs: [
            { name: 'people', label: 'Количество человек', type: 'number', min: 1, max: 10 },
            { name: 'gardenArea', label: 'Площадь участка (соток)', type: 'number', min: 1, max: 50 },
            { name: 'type', label: 'Тип компостера', type: 'select', options: [
                { value: 'box', text: 'Ящик' },
                { value: 'barrel', text: 'Бочка' },
                { value: 'pile', text: 'Куча' }
            ]}
        ],
        calculate: (inputs) => {
            // ~200л отходов на человека в год + 50л на сотку
            const yearlyVolume = inputs.people * 200 + inputs.gardenArea * 50;
            const composterVolume = yearlyVolume / 2; // Компост уменьшается в 2 раза
            
            let result = `Объем компостера: ${composterVolume.toFixed(0)} л`;
            
            if (inputs.type === 'box') {
                const side = Math.cbrt(composterVolume / 1000);
                result += `, размер ~${side.toFixed(1)}×${side.toFixed(1)}×${side.toFixed(1)} м`;
            } else if (inputs.type === 'barrel') {
                const barrels = Math.ceil(composterVolume / 200);
                result += `, ${barrels} бочек по 200л`;
            }
            
            return result;
        }
    },
    {
        id: 'mulch',
        title: 'Мульча',
        description: 'Расчет мульчи для грядок',
        category: 'garden',
        icon: '🌿',
        inputs: [
            { name: 'area', label: 'Площадь мульчирования (м²)', type: 'number', min: 0.1 },
            { name: 'thickness', label: 'Толщина слоя (см)', type: 'number', min: 2, max: 15, value: 5 },
            { name: 'material', label: 'Материал', type: 'select', options: [
                { value: 'bark', text: 'Кора' },
                { value: 'chips', text: 'Щепа' },
                { value: 'straw', text: 'Солома' },
                { value: 'gravel', text: 'Гравий' }
            ]}
        ],
        calculate: (inputs) => {
            const volumeM3 = inputs.area * (inputs.thickness / 100);
            const volumeL = volumeM3 * 1000;
            
            let packaging = '';
            if (inputs.material === 'bark' || inputs.material === 'chips') {
                const bags = Math.ceil(volumeL / 50);
                packaging = `, ${bags} мешков по 50л`;
            } else if (inputs.material === 'straw') {
                const bales = Math.ceil(inputs.area / 10); // 1 тюк на 10м²
                packaging = `, ${bales} тюков`;
            } else if (inputs.material === 'gravel') {
                const tons = volumeM3 * 1.5; // плотность ~1.5 т/м³
                packaging = `, ${tons.toFixed(1)} тонн`;
            }
            
            return `${volumeM3.toFixed(2)} м³ (${volumeL.toFixed(0)} л)${packaging}`;
        }
    },
    // More Auto calculators / Дополнительные автомобильные калькуляторы
    {
        id: 'tire_pressure',
        title: 'Давление в шинах',
        description: 'Расчет оптимального давления',
        category: 'auto',
        icon: '🛞',
        inputs: [
            { name: 'tireSize', label: 'Размер шин', type: 'select', options: [
                { value: '175/70R13', text: '175/70 R13' },
                { value: '185/65R14', text: '185/65 R14' },
                { value: '195/65R15', text: '195/65 R15' },
                { value: '205/55R16', text: '205/55 R16' },
                { value: '215/55R17', text: '215/55 R17' },
                { value: '225/45R18', text: '225/45 R18' }
            ]},
            { name: 'load', label: 'Загрузка', type: 'select', options: [
                                { value: 0.9, text: 'Минимальная (1-2 человека)' },
                { value: 1, text: 'Средняя (3-4 человека)' },
                { value: 1.1, text: 'Полная (5 человек + багаж)' }
            ]},
            { name: 'season', label: 'Сезон', type: 'select', options: [
                { value: 'summer', text: 'Лето' },
                { value: 'winter', text: 'Зима' }
            ]}
        ],
        calculate: (inputs) => {
            // Базовое давление для размеров шин
            const basePressure = {
                '175/70R13': 2.0,
                '185/65R14': 2.1,
                '195/65R15': 2.2,
                '205/55R16': 2.3,
                '215/55R17': 2.4,
                '225/45R18': 2.5
            };
            
            let pressure = basePressure[inputs.tireSize] * inputs.load;
            
            // Зимой давление чуть выше
            if (inputs.season === 'winter') {
                pressure += 0.1;
            }
            
            const front = pressure;
            const rear = pressure - 0.1; // Задние чуть меньше
            
            return `Передние: ${front.toFixed(1)} атм, Задние: ${rear.toFixed(1)} атм`;
        }
    },
    {
        id: 'brake_fluid',
        title: 'Тормозная жидкость',
        description: 'Расчет объема тормозной жидкости',
        category: 'auto',
        icon: '🛑',
        inputs: [
            { name: 'carType', label: 'Тип автомобиля', type: 'select', options: [
                { value: 0.5, text: 'Малолитражка' },
                { value: 0.7, text: 'Седан' },
                { value: 0.9, text: 'Кроссовер' },
                { value: 1.2, text: 'Внедорожник' }
            ]},
            { name: 'abs', label: 'Наличие ABS', type: 'select', options: [
                { value: 1, text: 'Без ABS' },
                { value: 1.3, text: 'С ABS' }
            ]},
            { name: 'flush', label: 'Тип замены', type: 'select', options: [
                { value: 1, text: 'Частичная' },
                { value: 2, text: 'Полная промывка' }
            ]}
        ],
        calculate: (inputs) => {
            const volume = inputs.carType * inputs.abs * inputs.flush;
            const bottles = Math.ceil(volume / 0.5); // Бутылки по 0.5л
            
            return `${volume.toFixed(1)} л (${bottles} бутылок по 0.5л)`;
        }
    },

    // More Other calculators / Дополнительные прочие калькуляторы
    {
        id: 'pool_volume',
        title: 'Объем бассейна',
        description: 'Расчет объема воды в бассейне',
        category: 'other',
        icon: '🏊',
        inputs: [
            { name: 'shape', label: 'Форма бассейна', type: 'select', options: [
                { value: 'rect', text: 'Прямоугольный' },
                { value: 'round', text: 'Круглый' },
                { value: 'oval', text: 'Овальный' }
            ]},
            { name: 'length', label: 'Длина (м)', type: 'number', min: 1, step: 0.1 },
            { name: 'width', label: 'Ширина (м)', type: 'number', min: 1, step: 0.1, 
              condition: (inputs) => inputs.shape !== 'round' },
            { name: 'depth', label: 'Глубина (м)', type: 'number', min: 0.5, max: 3, step: 0.1 },
            { name: 'fillLevel', label: 'Уровень заполнения (%)', type: 'number', min: 50, max: 100, value: 90 }
        ],
        calculate: (inputs) => {
            let volume;
            
            if (inputs.shape === 'rect') {
                volume = inputs.length * inputs.width * inputs.depth;
            } else if (inputs.shape === 'round') {
                volume = Math.PI * Math.pow(inputs.length / 2, 2) * inputs.depth;
            } else { // oval
                volume = Math.PI * (inputs.length / 2) * (inputs.width / 2) * inputs.depth;
            }
            
            volume *= inputs.fillLevel / 100;
            const liters = volume * 1000;
            const fillTime = liters / 600; // При скорости 10 л/мин
            
            return `${volume.toFixed(1)} м³ (${liters.toFixed(0)} л), время заполнения ~${fillTime.toFixed(0)} часов`;
        }
    },
    {
        id: 'pool_chemicals',
        title: 'Химия для бассейна',
        description: 'Расчет химических реагентов',
        category: 'other',
        icon: '🧪',
        inputs: [
            { name: 'volume', label: 'Объем бассейна (м³)', type: 'number', min: 1 },
            { name: 'treatment', label: 'Тип обработки', type: 'select', options: [
                { value: 'shock', text: 'Шоковая обработка' },
                { value: 'regular', text: 'Регулярная' },
                { value: 'algae', text: 'От водорослей' }
            ]},
            { name: 'chemical', label: 'Препарат', type: 'select', options: [
                { value: 'chlorine', text: 'Хлор' },
                { value: 'oxygen', text: 'Активный кислород' },
                { value: 'bromine', text: 'Бром' }
            ]}
        ],
        calculate: (inputs) => {
            const dosage = {
                shock: { chlorine: 15, oxygen: 20, bromine: 20 },
                regular: { chlorine: 3, oxygen: 5, bromine: 5 },
                algae: { chlorine: 10, oxygen: 15, bromine: 15 }
            };
            
            const amount = inputs.volume * dosage[inputs.treatment][inputs.chemical];
            const ph_minus = inputs.volume * 1.5; // pH минус
            const ph_plus = inputs.volume * 1; // pH плюс
            
            return `${inputs.chemical === 'chlorine' ? 'Хлор' : inputs.chemical === 'oxygen' ? 'Кислород' : 'Бром'}: ${amount} г, pH-: ${ph_minus} г, pH+: ${ph_plus} г`;
        }
    },
    {
        id: 'firewood',
        title: 'Дрова для отопления',
        description: 'Расчет дров на сезон',
        category: 'other',
        icon: '🪵',
        inputs: [
            { name: 'area', label: 'Площадь дома (м²)', type: 'number', min: 10 },
            { name: 'insulation', label: 'Утепление', type: 'select', options: [
                { value: 1.5, text: 'Плохое' },
                { value: 1, text: 'Среднее' },
                { value: 0.7, text: 'Хорошее' }
            ]},
            { name: 'woodType', label: 'Порода дерева', type: 'select', options: [
                { value: 1, text: 'Дуб, бук' },
                { value: 1.2, text: 'Береза' },
                { value: 1.4, text: 'Сосна, ель' },
                { value: 1.6, text: 'Осина, тополь' }
            ]},
            { name: 'season', label: 'Длительность сезона (месяцев)', type: 'number', min: 3, max: 8, value: 6 }
        ],
        calculate: (inputs) => {
            // Базовый расход: 0.1 м³ на 1 м² в месяц
            const volume = inputs.area * 0.1 * inputs.season * inputs.insulation * inputs.woodType;
            const weight = volume * 650; // Средняя плотность дров 650 кг/м³
            
            return `${volume.toFixed(1)} м³ (${(weight / 1000).toFixed(1)} тонн)`;
        }
    },
    {
        id: 'pellets',
        title: 'Пеллеты для котла',
        description: 'Расход пеллет на отопление',
        category: 'other',
        icon: '🔥',
        inputs: [
            { name: 'power', label: 'Мощность котла (кВт)', type: 'number', min: 5, max: 50 },
            { name: 'hours', label: 'Часов работы в сутки', type: 'number', min: 1, max: 24, value: 12 },
            { name: 'days', label: 'Дней в сезоне', type: 'number', min: 30, max: 240, value: 180 },
            { name: 'efficiency', label: 'КПД котла (%)', type: 'number', min: 70, max: 95, value: 85 }
        ],
        calculate: (inputs) => {
            // Расход пеллет: 0.2 кг на 1 кВт·ч
            const dailyConsumption = inputs.power * inputs.hours * 0.2 / (inputs.efficiency / 100);
            const seasonConsumption = dailyConsumption * inputs.days;
            const bags = Math.ceil(seasonConsumption / 15); // Мешки по 15 кг
            const tons = seasonConsumption / 1000;
            
            return `${seasonConsumption.toFixed(0)} кг (${tons.toFixed(1)} т), ${bags} мешков по 15 кг`;
        }
    },
    {
        id: 'air_conditioner',
        title: 'Мощность кондиционера',
        description: 'Подбор кондиционера по площади',
        category: 'other',
        icon: '❄️',
        inputs: [
            { name: 'area', label: 'Площадь помещения (м²)', type: 'number', min: 5, max: 100 },
            { name: 'height', label: 'Высота потолков (м)', type: 'number', min: 2.4, max: 4, step: 0.1, value: 2.7 },
            { name: 'windows', label: 'Окна', type: 'select', options: [
                { value: 1, text: 'Северная сторона' },
                { value: 1.2, text: 'Восток/Запад' },
                { value: 1.4, text: 'Южная сторона' }
            ]},
            { name: 'people', label: 'Количество людей', type: 'number', min: 1, max: 10, value: 2 },
            { name: 'equipment', label: 'Техника (компьютеры, ТВ)', type: 'number', min: 0, max: 10, value: 1 }
        ],
        calculate: (inputs) => {
            // Базовая мощность: 100 Вт/м² при высоте 2.7м
            const basePower = inputs.area * 100 * (inputs.height / 2.7) * inputs.windows;
            const peoplePower = inputs.people * 150; // 150 Вт на человека
            const equipmentPower = inputs.equipment * 300; // 300 Вт на устройство
            
            const totalWatts = basePower + peoplePower + equipmentPower;
            const totalBTU = totalWatts * 3.412;
            
            // Стандартные размеры
            const sizes = [7000, 9000, 12000, 18000, 24000];
            const recommended = sizes.find(size => size >= totalBTU) || sizes[sizes.length - 1];
            
            return `${(totalWatts / 1000).toFixed(1)} кВт (${Math.round(totalBTU)} BTU), рекомендуется ${recommended} BTU`;
        }
    },
    {
        id: 'ventilation_rate',
        title: 'Расчет вентиляции',
        description: 'Производительность вентиляции',
        category: 'other',
        icon: '💨',
        inputs: [
            { name: 'roomType', label: 'Тип помещения', type: 'select', options: [
                { value: 3, text: 'Жилая комната' },
                { value: 8, text: 'Кухня' },
                { value: 10, text: 'Ванная' },
                { value: 5, text: 'Туалет' },
                { value: 2, text: 'Кладовая' }
            ]},
            { name: 'area', label: 'Площадь (м²)', type: 'number', min: 1 },
            { name: 'height', label: 'Высота (м)', type: 'number', min: 2, max: 4, step: 0.1, value: 2.7 }
        ],
        calculate: (inputs) => {
            const volume = inputs.area * inputs.height;
            const airExchange = volume * inputs.roomType;
            
            // Подбор вентилятора
            const fanPower = Math.ceil(airExchange / 50) * 50; // Округление до 50
            
            return `${airExchange.toFixed(0)} м³/час (вентилятор от ${fanPower} м³/час)`;
        }
    },
    {
        id: 'solar_panels',
        title: 'Солнечные панели',
        description: 'Расчет солнечной электростанции',
        category: 'other',
        icon: '☀️',
        inputs: [
            { name: 'consumption', label: 'Потребление (кВт·ч/месяц)', type: 'number', min: 50 },
            { name: 'region', label: 'Регион', type: 'select', options: [
                                { value: 3, text: 'Северный (3 часа)' },
                { value: 4, text: 'Центральный (4 часа)' },
                { value: 5, text: 'Южный (5 часов)' }
            ]},
            { name: 'panelPower', label: 'Мощность панели (Вт)', type: 'number', min: 100, max: 500, value: 300 },
            { name: 'efficiency', label: 'КПД системы (%)', type: 'number', min: 70, max: 90, value: 80 }
        ],
        calculate: (inputs) => {
            const dailyConsumption = inputs.consumption / 30;
            const requiredPower = dailyConsumption / inputs.region / (inputs.efficiency / 100);
            const panels = Math.ceil((requiredPower * 1000) / inputs.panelPower);
            const totalPower = panels * inputs.panelPower;
            
            // Площадь панелей (примерно 2м² на 300Вт)
            const area = panels * (inputs.panelPower / 150);
            
            // Батареи (12В 200Ач на каждые 2.4 кВт·ч)
            const batteries = Math.ceil(dailyConsumption / 2.4);
            
            return `Панели: ${panels} шт (${totalPower} Вт), площадь ${area.toFixed(1)} м², батареи: ${batteries} шт`;
        }
    },
    {
        id: 'generator_power',
        title: 'Мощность генератора',
        description: 'Подбор генератора для дома',
        category: 'other',
        icon: '⚡',
        inputs: [
            { name: 'devices', label: 'Основные приборы', type: 'select', options: [
                { value: 3, text: 'Минимум (свет, холодильник)' },
                { value: 5, text: 'Средний (+ ТВ, компьютер)' },
                { value: 8, text: 'Комфорт (+ стиралка, микроволновка)' },
                { value: 12, text: 'Полный (+ электроплита, бойлер)' }
            ]},
            { name: 'startingPower', label: 'Пусковые токи', type: 'select', options: [
                { value: 1.5, text: 'Учесть (×1.5)' },
                { value: 1, text: 'Не учитывать' }
            ]},
            { name: 'reserve', label: 'Запас мощности (%)', type: 'number', min: 10, max: 50, value: 20 }
        ],
        calculate: (inputs) => {
            const basePower = inputs.devices * inputs.startingPower;
            const totalPower = basePower * (1 + inputs.reserve / 100);
            
            // Расход топлива (примерно 0.3 л/кВт·ч)
            const fuelConsumption = totalPower * 0.3;
            
            // Стандартные мощности генераторов
            const sizes = [2, 3, 5, 6.5, 8, 10, 15, 20];
            const recommended = sizes.find(size => size >= totalPower) || sizes[sizes.length - 1];
            
            return `Расчетная: ${totalPower.toFixed(1)} кВт, рекомендуется: ${recommended} кВт (расход ~${fuelConsumption.toFixed(1)} л/час)`;
        }
    },
    {
        id: 'water_heater',
        title: 'Объем бойлера',
        description: 'Подбор водонагревателя',
        category: 'other',
        icon: '🚿',
        inputs: [
            { name: 'people', label: 'Количество человек', type: 'number', min: 1, max: 10 },
            { name: 'usage', label: 'Использование', type: 'select', options: [
                { value: 30, text: 'Экономное (30 л/чел)' },
                { value: 50, text: 'Среднее (50 л/чел)' },
                { value: 80, text: 'Комфортное (80 л/чел)' }
            ]},
            { name: 'simultaneous', label: 'Одновременное использование', type: 'select', options: [
                { value: 0.6, text: 'Редко (×0.6)' },
                { value: 0.8, text: 'Иногда (×0.8)' },
                { value: 1, text: 'Часто (×1.0)' }
            ]}
        ],
        calculate: (inputs) => {
            const volume = inputs.people * inputs.usage * inputs.simultaneous;
            
            // Стандартные объемы бойлеров
            const sizes = [30, 50, 80, 100, 150, 200, 300];
            const recommended = sizes.find(size => size >= volume) || sizes[sizes.length - 1];
            
            // Время нагрева (примерно)
            const heatingTime = recommended * 0.04; // часов при 2кВт
            
            // Расход электроэнергии в месяц
            const monthlyKWh = recommended * 0.05 * 30; // примерно
            
            return `Расчетный: ${volume.toFixed(0)} л, рекомендуется: ${recommended} л (нагрев ~${heatingTime.toFixed(1)} ч, ~${monthlyKWh.toFixed(0)} кВт·ч/мес)`;
        }
    },
    {
        id: 'internet_cable',
        title: 'Интернет-кабель',
        description: 'Расчет сетевого кабеля',
        category: 'other',
        icon: '🌐',
        inputs: [
            { name: 'points', label: 'Количество точек', type: 'number', min: 1 },
            { name: 'avgDistance', label: 'Средняя длина до точки (м)', type: 'number', min: 1 },
            { name: 'cableType', label: 'Категория кабеля', type: 'select', options: [
                { value: 'cat5e', text: 'Cat5e (до 1 Гбит/с)' },
                { value: 'cat6', text: 'Cat6 (до 10 Гбит/с)' },
                { value: 'cat6a', text: 'Cat6a (до 10 Гбит/с, 100м)' },
                { value: 'cat7', text: 'Cat7 (до 10 Гбит/с, экран)' }
            ]},
            { name: 'reserve', label: 'Запас (%)', type: 'number', min: 10, max: 50, value: 20 }
        ],
        calculate: (inputs) => {
            const totalLength = inputs.points * inputs.avgDistance * (1 + inputs.reserve / 100);
            const boxes = Math.ceil(totalLength / 305); // Бухта 305м
            
            // Дополнительные материалы
            const connectors = inputs.points * 2; // По 2 на точку
            const sockets = inputs.points;
            
            return `Кабель ${inputs.cableType}: ${totalLength.toFixed(0)} м (${boxes} бухт), коннекторы RJ45: ${connectors} шт, розетки: ${sockets} шт`;
        }
    },
    {
        id: 'security_cameras',
        title: 'Видеонаблюдение',
        description: 'Расчет системы видеонаблюдения',
        category: 'other',
        icon: '📹',
        inputs: [
            { name: 'cameras', label: 'Количество камер', type: 'number', min: 1, max: 32 },
            { name: 'resolution', label: 'Разрешение', type: 'select', options: [
                { value: 1, text: '720p (1 Мп)' },
                { value: 2, text: '1080p (2 Мп)' },
                { value: 4, text: '2K (4 Мп)' },
                { value: 8, text: '4K (8 Мп)' }
            ]},
            { name: 'days', label: 'Дней записи', type: 'number', min: 7, max: 90, value: 30 },
            { name: 'fps', label: 'Кадров в секунду', type: 'select', options: [
                { value: 15, text: '15 fps' },
                { value: 25, text: '25 fps' },
                { value: 30, text: '30 fps' }
            ]}
        ],
        calculate: (inputs) => {
            // Битрейт в Мбит/с для H.264
            const bitrates = { 1: 2, 2: 4, 4: 8, 8: 16 };
            const bitrate = bitrates[inputs.resolution];
            
            // Расчет объема хранилища
            const gbPerDay = (bitrate * inputs.fps / 25 * inputs.cameras * 86400) / 8 / 1024;
            const totalGB = gbPerDay * inputs.days;
            const totalTB = totalGB / 1024;
            
            // Рекомендуемый HDD
            const hddSizes = [1, 2, 4, 6, 8, 10, 12];
            const recommendedHDD = hddSizes.find(size => size >= totalTB) || hddSizes[hddSizes.length - 1];
            
            return `Требуется: ${totalTB.toFixed(1)} ТБ, HDD: ${recommendedHDD} ТБ (${gbPerDay.toFixed(1)} ГБ/день)`;
        }
    },
    {
        id: 'sound_insulation',
        title: 'Звукоизоляция',
        description: 'Материалы для шумоизоляции',
        category: 'other',
        icon: '🔇',
        inputs: [
            { name: 'area', label: 'Площадь поверхности (м²)', type: 'number', min: 1 },
            { name: 'type', label: 'Тип шумоизоляции', type: 'select', options: [
                { value: 'basic', text: 'Базовая (−20 дБ)' },
                { value: 'standard', text: 'Стандартная (−30 дБ)' },
                { value: 'premium', text: 'Премиум (−40 дБ)' },
                { value: 'studio', text: 'Студийная (−50 дБ)' }
            ]},
            { name: 'surface', label: 'Поверхность', type: 'select', options: [
                { value: 'wall', text: 'Стены' },
                { value: 'ceiling', text: 'Потолок' },
                { value: 'floor', text: 'Пол' }
            ]}
        ],
        calculate: (inputs) => {
            const materials = {
                basic: { thickness: 50, layers: 1, density: 30 },
                standard: { thickness: 100, layers: 2, density: 50 },
                premium: { thickness: 150, layers: 3, density: 80 },
                studio: { thickness: 200, layers: 4, density: 100 }
            };
            
            const mat = materials[inputs.type];
            const volume = inputs.area * (mat.thickness / 1000);
            const weight = volume * mat.density;
            
            // Дополнительные материалы
            const membrane = inputs.type !== 'basic' ? inputs.area : 0;
            const profile = inputs.area * 3; // Профиль через каждые 0.6м
            
            return `Изоляция: ${volume.toFixed(1)} м³ (${weight.toFixed(0)} кг), ${mat.layers} слоев${membrane > 0 ? `, мембрана: ${membrane.toFixed(0)} м²` : ''}, профиль: ${profile.toFixed(0)} м`;
        }
    },
    // Дополнительный для electric
    {
        id: 'smart_home',
        title: 'Умный дом',
        description: 'Расчет компонентов умного дома',
        category: 'electric',
        icon: '🏠',
        inputs: [
            { name: 'rooms', label: 'Количество комнат', type: 'number', min: 1, max: 20 },
            { name: 'level', label: 'Уровень автоматизации', type: 'select', options: [
                { value: 'basic', text: 'Базовый (свет, розетки)' },
                { value: 'comfort', text: 'Комфорт (+ климат, шторы)' },
                { value: 'premium', text: 'Премиум (+ безопасность, мультимедиа)' }
            ]},
            { name: 'control', label: 'Управление', type: 'select', options: [
                { value: 'app', text: 'Приложение' },
                { value: 'voice', text: 'Голос + приложение' },
                { value: 'full', text: 'Полное (+ сценарии)' }
            ]}
        ],
        calculate: (inputs) => {
            const devices = {
                basic: { switches: 2, sensors: 1, hub: 1 },
                comfort: { switches: 3, sensors: 2, hub: 1, climate: 1 },
                premium: { switches: 4, sensors: 4, hub: 2, climate: 1, cameras: 2 }
            };
            
            const dev = devices[inputs.level];
            const totalSwitches = dev.switches * inputs.rooms;
            const totalSensors = dev.sensors * inputs.rooms;
            
            return `Выключатели: ${totalSwitches}, датчики: ${totalSensors}, хабы: ${dev.hub}, климат: ${dev.climate || 0}${dev.cameras ? `, камеры: ${dev.cameras}` : ''}`;
        }
    },

    // Дополнительный для plumbing
    {
        id: 'water_filter',
        title: 'Система фильтрации',
        description: 'Расчет фильтров для воды',
        category: 'plumbing',
        icon: '💧',
        inputs: [
            { name: 'people', label: 'Количество человек', type: 'number', min: 1, max: 10 },
            { name: 'waterQuality', label: 'Качество воды', type: 'select', options: [
                { value: 'good', text: 'Хорошее (городская)' },
                { value: 'medium', text: 'Среднее (скважина)' },
                { value: 'poor', text: 'Плохое (требует очистки)' }
            ]},
            { name: 'usage', label: 'Потребление воды (л/чел/день)', type: 'number', min: 50, max: 300, value: 150 }
        ],
        calculate: (inputs) => {
            const dailyUsage = inputs.people * inputs.usage;
            const yearlyUsage = dailyUsage * 365;
            
            const filterCapacity = {
                good: 10000,
                medium: 6000,
                poor: 3000
            };
            
            const cartridges = Math.ceil(yearlyUsage / filterCapacity[inputs.waterQuality]);
            const stages = inputs.waterQuality === 'good' ? 3 : inputs.waterQuality === 'medium' ? 4 : 5;
            
            return `${stages}-ступенчатая система, ${cartridges} комплектов картриджей/год, ${dailyUsage} л/день`;
        }
    },

    // Дополнительный для cooking
    {
        id: 'bread_calculator',
        title: 'Расчет теста для хлеба',
        description: 'Ингредиенты для выпечки хлеба',
        category: 'cooking',
        icon: '🍞',
        inputs: [
            { name: 'loaves', label: 'Количество буханок', type: 'number', min: 1, max: 10 },
            { name: 'loafWeight', label: 'Вес буханки (г)', type: 'number', min: 300, max: 1000, value: 500 },
            { name: 'breadType', label: 'Тип хлеба', type: 'select', options: [
                { value: 'white', text: 'Белый' },
                { value: 'whole', text: 'Цельнозерновой' },
                { value: 'rye', text: 'Ржаной' },
                { value: 'mixed', text: 'Смешанный' }
            ]}
        ],
        calculate: (inputs) => {
            const totalWeight = inputs.loaves * inputs.loafWeight;
            const flourWeight = totalWeight * 0.6; // 60% муки
            
            const recipes = {
                white: { water: 0.65, yeast: 0.02, salt: 0.02, sugar: 0.03 },
                whole: { water: 0.7, yeast: 0.025, salt: 0.02, sugar: 0.02 },
                rye: { water: 0.75, yeast: 0.03, salt: 0.02, sugar: 0.01 },
                mixed: { water: 0.68, yeast: 0.025, salt: 0.02, sugar: 0.02 }
            };
            
            const recipe = recipes[inputs.breadType];
            
            return `Мука: ${flourWeight.toFixed(0)} г, вода: ${(flourWeight * recipe.water).toFixed(0)} мл, дрожжи: ${(flourWeight * recipe.yeast).toFixed(0)} г, соль: ${(flourWeight * recipe.salt).toFixed(0)} г`;
        }
    },

    // Дополнительный для garden
    {
        id: 'lawn_care',
        title: 'Уход за газоном',
        description: 'График ухода за газоном',
        category: 'garden',
        icon: '🌱',
        inputs: [
            { name: 'area', label: 'Площадь газона (м²)', type: 'number', min: 10 },
            { name: 'grassType', label: 'Тип газона', type: 'select', options: [
                { value: 'sport', text: 'Спортивный' },
                { value: 'decorative', text: 'Декоративный' },
                { value: 'universal', text: 'Универсальный' }
            ]},
            { name: 'season', label: 'Сезон', type: 'select', options: [
                { value: 'spring', text: 'Весна' },
                { value: 'summer', text: 'Лето' },
                { value: 'autumn', text: 'Осень' }
            ]}
        ],
        calculate: (inputs) => {
            const fertilizer = {
                spring: { n: 30, p: 10, k: 20 },
                summer: { n: 20, p: 5, k: 10 },
                autumn: { n: 10, p: 15, k: 30 }
            };
            
            const fert = fertilizer[inputs.season];
            const totalFert = inputs.area * (fert.n + fert.p + fert.k) / 1000;
            
            const mowing = inputs.grassType === 'sport' ? 'раз в 5 дней' : inputs.grassType === 'decorative' ? 'раз в неделю' : 'раз в 10 дней';
            
            return `Удобрения: ${totalFert.toFixed(1)} кг (N:P:K = ${fert.n}:${fert.p}:${fert.k}), стрижка ${mowing}, полив ${inputs.area * 5} л/день`;
        }
    },
     // Дополнительные для other
    {
        id: 'moving_boxes',
        title: 'Коробки для переезда',
        description: 'Расчет упаковки для переезда',
        category: 'other',
        icon: '📦',
        inputs: [
            { name: 'rooms', label: 'Количество комнат', type: 'number', min: 1, max: 10 },
            { name: 'people', label: 'Количество человек', type: 'number', min: 1, max: 10 },
            { name: 'moveType', label: 'Тип переезда', type: 'select', options: [
                { value: 'minimal', text: 'Минимальный' },
                { value: 'standard', text: 'Стандартный' },
                { value: 'full', text: 'С мебелью' }
            ]}
        ],
        calculate: (inputs) => {
            const boxesPerRoom = {
                minimal: 5,
                standard: 10,
                full: 15
            };
            
            const smallBoxes = inputs.rooms * boxesPerRoom[inputs.moveType] * 0.4;
            const mediumBoxes = inputs.rooms * boxesPerRoom[inputs.moveType] * 0.4;
            const largeBoxes = inputs.rooms * boxesPerRoom[inputs.moveType] * 0.2;
            
            const tape = Math.ceil((smallBoxes + mediumBoxes + largeBoxes) / 10); // 1 моток на 10 коробок
            const bubble = inputs.rooms * 10; // 10м на комнату
            
            return `Малые: ${Math.ceil(smallBoxes)}, средние: ${Math.ceil(mediumBoxes)}, большие: ${Math.ceil(largeBoxes)}, скотч: ${tape} мотков, пузырчатая пленка: ${bubble} м`;
        }
    },
    {
        id: 'aquarium',
        title: 'Аквариум',
        description: 'Расчет оборудования для аквариума',
        category: 'other',
        icon: '🐠',
        inputs: [
            { name: 'length', label: 'Длина (см)', type: 'number', min: 20, max: 200 },
            { name: 'width', label: 'Ширина (см)', type: 'number', min: 20, max: 100 },
            { name: 'height', label: 'Высота (см)', type: 'number', min: 20, max: 100 },
            { name: 'fishType', label: 'Тип рыб', type: 'select', options: [
                { value: 'small', text: 'Мелкие (гуппи, неоны)' },
                { value: 'medium', text: 'Средние (барбусы, гурами)' },
                { value: 'large', text: 'Крупные (цихлиды)' }
            ]}
        ],
        calculate: (inputs) => {
            const volumeL = (inputs.length * inputs.width * inputs.height) / 1000;
            
            // Фильтр должен прокачивать 3-5 объемов в час
            const filterPower = volumeL * 4;
            
            // Нагреватель 1 Вт на 1 л
            const heaterPower = volumeL;
            
            // Количество рыб
            const fishCount = {
                small: volumeL / 3,
                medium: volumeL / 10,
                large: volumeL / 30
            };
            
            // Грунт 5-7 см
            const substrate = (inputs.length * inputs.width * 6) / 1000;
            
            return `Объем: ${volumeL.toFixed(0)} л, фильтр: ${filterPower.toFixed(0)} л/ч, нагреватель: ${heaterPower.toFixed(0)} Вт, рыб: до ${Math.floor(fishCount[inputs.fishType])} шт, грунт: ${substrate.toFixed(1)} кг`;
        }
    },
    {
        id: 'home_gym',
        title: 'Домашний спортзал',
        description: 'Расчет оборудования для спортзала',
        category: 'other',
        icon: '🏋️',
        inputs: [
            { name: 'area', label: 'Площадь помещения (м²)', type: 'number', min: 4, max: 50 },
            { name: 'goals', label: 'Цели тренировок', type: 'select', options: [
                { value: 'cardio', text: 'Кардио' },
                { value: 'strength', text: 'Силовые' },
                { value: 'mixed', text: 'Смешанные' },
                { value: 'yoga', text: 'Йога/пилатес' }
            ]},
            { name: 'budget', label: 'Бюджет', type: 'select', options: [
                { value: 'minimal', text: 'Минимальный' },
                { value: 'standard', text: 'Стандартный' },
                { value: 'premium', text: 'Премиум' }
            ]}
        ],
        calculate: (inputs) => {
            const equipment = {
                cardio: {
                    minimal: 'Скакалка, коврик',
                    standard: 'Беговая дорожка, коврик',
                    premium: 'Беговая дорожка, велотренажер, эллипсоид'
                },
                strength: {
                    minimal: 'Гантели разборные, турник',
                    standard: 'Штанга, стойки, скамья, гантели',
                    premium: 'Силовая рама, штанга, гантели, тренажеры'
                },
                mixed: {
                    minimal: 'Гантели, коврик, турник',
                    standard: 'Беговая дорожка, гантели, скамья',
                    premium: 'Мультистанция, кардио-тренажер, свободные веса'
                },
                yoga: {
                    minimal: 'Коврик, блоки, ремень',
                    standard: 'Коврик, блоки, болстер, ремни',
                    premium: 'Профессиональное оборудование для йоги'
                }
            };
            
            const flooring = inputs.area * (inputs.goals === 'strength' ? 1 : 0.5);
            const mirrors = inputs.goals !== 'cardio' ? Math.ceil(inputs.area / 10) : 0;
            
                        return `${equipment[inputs.goals][inputs.budget]}, резиновое покрытие: ${flooring.toFixed(0)} м²${mirrors > 0 ? `, зеркала: ${mirrors} шт` : ''}`;
        }
    },
    {
        id: 'pet_supplies',
        title: 'Расходы на питомца',
        description: 'Расчет содержания домашнего животного',
        category: 'other',
        icon: '🐕',
        inputs: [
            { name: 'petType', label: 'Тип питомца', type: 'select', options: [
                { value: 'cat', text: 'Кошка' },
                { value: 'small_dog', text: 'Собака мелкая (до 10 кг)' },
                { value: 'medium_dog', text: 'Собака средняя (10-25 кг)' },
                { value: 'large_dog', text: 'Собака крупная (более 25 кг)' }
            ]},
            { name: 'foodType', label: 'Тип корма', type: 'select', options: [
                { value: 'economy', text: 'Эконом' },
                { value: 'premium', text: 'Премиум' },
                { value: 'super_premium', text: 'Супер-премиум' }
            ]},
            { name: 'period', label: 'Период расчета', type: 'select', options: [
                { value: 1, text: 'Месяц' },
                { value: 12, text: 'Год' }
            ]}
        ],
        calculate: (inputs) => {
            const foodConsumption = {
                cat: { economy: 3, premium: 2.5, super_premium: 2 },
                small_dog: { economy: 4, premium: 3, super_premium: 2.5 },
                medium_dog: { economy: 8, premium: 6, super_premium: 5 },
                large_dog: { economy: 15, premium: 12, super_premium: 10 }
            };
            
            const foodKg = foodConsumption[inputs.petType][inputs.foodType] * inputs.period;
            const litter = inputs.petType === 'cat' ? 5 * inputs.period : 0;
            const vetVisits = inputs.period === 12 ? 2 : 0.2;
            const grooming = inputs.petType.includes('dog') ? inputs.period : inputs.period / 3;
            
            return `Корм: ${foodKg} кг${litter > 0 ? `, наполнитель: ${litter} кг` : ''}, ветеринар: ${vetVisits.toFixed(1)} визитов, груминг: ${grooming.toFixed(0)} раз`;
        }
    },
    {
        id: 'greenhouse_heating',
        title: 'Отопление теплицы',
        description: 'Расчет обогрева теплицы',
        category: 'other',
        icon: '🌡️',
        inputs: [
            { name: 'length', label: 'Длина теплицы (м)', type: 'number', min: 2, max: 20 },
            { name: 'width', label: 'Ширина теплицы (м)', type: 'number', min: 2, max: 10 },
            { name: 'height', label: 'Высота теплицы (м)', type: 'number', min: 2, max: 4, value: 2.5 },
            { name: 'tempDiff', label: 'Разница температур (°C)', type: 'number', min: 10, max: 40, value: 20 },
            { name: 'material', label: 'Материал покрытия', type: 'select', options: [
                { value: 5.8, text: 'Стекло 4мм' },
                { value: 3.5, text: 'Поликарбонат 4мм' },
                { value: 2.3, text: 'Поликарбонат 8мм' },
                { value: 1.5, text: 'Поликарбонат 16мм' }
            ]}
        ],
        calculate: (inputs) => {
            // Площадь поверхности теплицы (упрощенно)
            const surfaceArea = 2 * inputs.length * inputs.height + 
                               2 * inputs.width * inputs.height + 
                               inputs.length * inputs.width;
            
            // Теплопотери = площадь × коэффициент × разница температур
            const heatLoss = surfaceArea * inputs.material * inputs.tempDiff;
            const heatLossKW = heatLoss / 1000;
            
            // Расход топлива
            const electricKWh = heatLossKW * 24; // кВт·ч в сутки
            const gasM3 = heatLossKW * 2.4; // м³ газа в сутки
            
            return `Теплопотери: ${heatLossKW.toFixed(1)} кВт, электричество: ${electricKWh.toFixed(0)} кВт·ч/сутки, газ: ${gasM3.toFixed(1)} м³/сутки`;
        }
    },
    {
        id: 'sauna_materials',
        title: 'Материалы для бани',
        description: 'Расчет материалов для сауны/бани',
        category: 'other',
        icon: '🧖',
        inputs: [
            { name: 'length', label: 'Длина парной (м)', type: 'number', min: 1.5, max: 5, step: 0.1 },
            { name: 'width', label: 'Ширина парной (м)', type: 'number', min: 1.5, max: 4, step: 0.1 },
            { name: 'height', label: 'Высота парной (м)', type: 'number', min: 2, max: 2.5, step: 0.1, value: 2.2 },
            { name: 'wood', label: 'Порода дерева', type: 'select', options: [
                { value: 'linden', text: 'Липа' },
                { value: 'aspen', text: 'Осина' },
                { value: 'cedar', text: 'Кедр' },
                { value: 'alder', text: 'Ольха' }
            ]}
        ],
        calculate: (inputs) => {
            const wallArea = 2 * (inputs.length + inputs.width) * inputs.height;
            const ceilingArea = inputs.length * inputs.width;
            const totalArea = wallArea + ceilingArea;
            
            // Вагонка с учетом отходов
            const lining = totalArea * 1.15;
            
            // Утеплитель (100мм)
            const insulation = totalArea * 0.1;
            
            // Фольга
            const foil = totalArea * 1.1;
            
            // Полки (30% от площади пола)
            const benchArea = inputs.length * inputs.width * 0.3;
            
            // Печь (1 кВт на 1 м³)
            const volume = inputs.length * inputs.width * inputs.height;
            const stovePower = Math.ceil(volume);
            
            return `Вагонка: ${lining.toFixed(1)} м², утеплитель: ${insulation.toFixed(1)} м³, фольга: ${foil.toFixed(1)} м², полки: ${benchArea.toFixed(1)} м², печь: ${stovePower} кВт`;
        }
    },
    {
        id: 'workshop_tools',
        title: 'Оборудование мастерской',
        description: 'Базовый набор инструментов',
        category: 'other',
        icon: '🔧',
        inputs: [
            { name: 'type', label: 'Тип мастерской', type: 'select', options: [
                { value: 'wood', text: 'Столярная' },
                { value: 'metal', text: 'Слесарная' },
                { value: 'auto', text: 'Автомобильная' },
                { value: 'universal', text: 'Универсальная' }
            ]},
            { name: 'level', label: 'Уровень оснащения', type: 'select', options: [
                { value: 'hobby', text: 'Хобби' },
                { value: 'semi_pro', text: 'Полупрофессиональный' },
                { value: 'pro', text: 'Профессиональный' }
            ]},
            { name: 'area', label: 'Площадь мастерской (м²)', type: 'number', min: 6, max: 100 }
        ],
        calculate: (inputs) => {
            const tools = {
                wood: {
                    hobby: 'Ручной инструмент, дрель, лобзик',
                    semi_pro: '+ циркулярка, фрезер, шлифмашина',
                    pro: '+ станки (рейсмус, фуганок, токарный)'
                },
                metal: {
                    hobby: 'Ручной инструмент, дрель, болгарка',
                    semi_pro: '+ сварочный аппарат, точило',
                    pro: '+ токарный станок, фрезерный станок'
                },
                auto: {
                    hobby: 'Набор ключей, домкрат, компрессор',
                    semi_pro: '+ подъемник/яма, сварка',
                    pro: '+ диагностическое оборудование, спецтехника'
                },
                universal: {
                    hobby: 'Базовый набор инструментов',
                    semi_pro: 'Расширенный набор + электроинструмент',
                    pro: 'Полный набор + станки'
                }
            };
            
            const workbenches = Math.ceil(inputs.area / 15);
            const storage = Math.ceil(inputs.area / 10);
            
            return `${tools[inputs.type][inputs.level]}, верстаки: ${workbenches} шт, стеллажи: ${storage} шт`;
        }
    },
    {
        id: 'event_tent',
        title: 'Шатер для мероприятий',
        description: 'Расчет размера шатра',
        category: 'other',
        icon: '🎪',
        inputs: [
            { name: 'guests', label: 'Количество гостей', type: 'number', min: 10, max: 500 },
            { name: 'eventType', label: 'Тип мероприятия', type: 'select', options: [
                { value: 'standing', text: 'Фуршет (стоя)' },
                { value: 'mixed', text: 'Смешанный' },
                { value: 'seated', text: 'Банкет (сидя)' },
                { value: 'concert', text: 'Концерт' }
            ]},
            { name: 'extras', label: 'Дополнительно', type: 'select', options: [
                { value: 1, text: 'Только гости' },
                { value: 1.2, text: '+ сцена/танцпол' },
                { value: 1.4, text: '+ сцена + бар' }
            ]}
        ],
        calculate: (inputs) => {
            const spacePerPerson = {
                standing: 0.5,
                mixed: 1,
                seated: 1.5,
                concert: 0.3
            };
            
            const baseArea = inputs.guests * spacePerPerson[inputs.eventType] * inputs.extras;
            
            // Стандартные размеры шатров
            const tentSizes = [
                { area: 25, size: '5×5' },
                { area: 50, size: '5×10' },
                { area: 100, size: '10×10' },
                { area: 150, size: '10×15' },
                { area: 200, size: '10×20' },
                { area: 300, size: '15×20' },
                { area: 500, size: '20×25' }
            ];
            
            const tent = tentSizes.find(t => t.area >= baseArea) || tentSizes[tentSizes.length - 1];
            
            // Дополнительное оборудование
            const tables = inputs.eventType === 'seated' ? Math.ceil(inputs.guests / 8) : 0;
            const chairs = inputs.eventType !== 'standing' ? inputs.guests : 0;
            
            return `Шатер ${tent.size} м (${tent.area} м²)${tables > 0 ? `, столы: ${tables}` : ''}${chairs > 0 ? `, стулья: ${chairs}` : ''}`;
        }
    },
    {
        id: 'storage_unit',
        title: 'Складское помещение',
        description: 'Расчет стеллажей для склада',
        category: 'other',
        icon: '📦',
        inputs: [
            { name: 'area', label: 'Площадь склада (м²)', type: 'number', min: 10, max: 1000 },
            { name: 'height', label: 'Высота помещения (м)', type: 'number', min: 2.5, max: 10, step: 0.5 },
            { name: 'loadType', label: 'Тип груза', type: 'select', options: [
                { value: 'light', text: 'Легкий (до 100 кг/м²)' },
                { value: 'medium', text: 'Средний (100-500 кг/м²)' },
                { value: 'heavy', text: 'Тяжелый (более 500 кг/м²)' }
            ]},
            { name: 'access', label: 'Доступ к товару', type: 'select', options: [
                { value: 'manual', text: 'Ручной' },
                { value: 'forklift', text: 'Погрузчик' }
            ]}
        ],
        calculate: (inputs) => {
            // Полезная площадь (70% от общей)
            const usableArea = inputs.area * 0.7;
            
            // Высота стеллажей
            const rackHeight = inputs.access === 'manual' ? Math.min(2.5, inputs.height - 0.5) : inputs.height - 1;
            
            // Количество ярусов
            const tiers = Math.floor(rackHeight / 0.5);
            
            // Площадь стеллажей
            const rackArea = usableArea * 0.6; // 60% под стеллажи, 40% проходы
                        // Количество стеллажных секций (1.2м × 0.6м)
            const rackSections = Math.floor(rackArea / 0.72);
            
            // Грузоподъемность
            const loadCapacity = {
                light: 200,
                medium: 500,
                heavy: 1000
            };
            
            const totalCapacity = rackSections * tiers * loadCapacity[inputs.loadType];
            
            return `Стеллажи: ${rackSections} секций, ярусов: ${tiers}, общая нагрузка: ${(totalCapacity / 1000).toFixed(1)} т, полезная площадь: ${usableArea.toFixed(0)} м²`;
        }
    }
];


// Обновляем счетчик категорий в renderCalculators
function getCategoryCount() {
    const categoryCounts = {};
    calculators.forEach(calc => {
        categoryCounts[calc.category] = (categoryCounts[calc.category] || 0) + 1;
    });
    return categoryCounts;
}

// Добавляем отображение количества калькуляторов
function updateCategoryButtons() {
    const counts = getCategoryCount();
    categoryButtons.forEach(btn => {
        const category = btn.dataset.category;
        if (category !== 'all') {
            const count = counts[category] || 0;
            btn.textContent = `${btn.textContent.split(' (')[0]} (${count})`;
        } else {
            btn.textContent = `Все (${calculators.length})`;
        }
    });
}

// Вызываем обновление при инициализации
function init() {
    // Load theme / Загрузка темы
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Update category counts / Обновление счетчиков категорий
    updateCategoryButtons();
    
    // Render calculators / Отрисовка калькуляторов
    renderCalculators();
    
    // Event listeners / Обработчики событий
    setupEventListeners();
}

// DOM Elements / DOM элементы
const calculatorsGrid = document.getElementById('calculatorsGrid');
const modal = document.getElementById('calculatorModal');
const modalTitle = document.getElementById('modalTitle');
const calculatorForm = document.getElementById('calculatorForm');
const resultValue = document.getElementById('resultValue');
const searchInput = document.querySelector('.search-input');
const themeToggle = document.querySelector('.theme-toggle');
const categoryButtons = document.querySelectorAll('.category-btn');

// State / Состояние
let currentCategory = 'all';
let currentCalculator = null;

// Initialize / Инициализация
function init() {
    // Load theme / Загрузка темы
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Render calculators / Отрисовка калькуляторов
    renderCalculators();
    
    // Event listeners / Обработчики событий
    setupEventListeners();
}

// Render calculators / Отрисовка калькуляторов
function renderCalculators(searchTerm = '') {
    const filteredCalculators = calculators.filter(calc => {
        const matchesCategory = currentCategory === 'all' || calc.category === currentCategory;
        const matchesSearch = calc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            calc.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    
    calculatorsGrid.innerHTML = filteredCalculators.map(calc => `
        <div class="calculator-card fade-in" data-id="${calc.id}">
            <div class="calculator-icon">${calc.icon}</div>
            <h3 class="calculator-title">${calc.title}</h3>
            <p class="calculator-description">${calc.description}</p>
        </div>
    `).join('');
    
    // Add click handlers / Добавление обработчиков клика
    document.querySelectorAll('.calculator-card').forEach(card => {
        card.addEventListener('click', () => openCalculator(card.dataset.id));
    });
}

// Open calculator modal / Открытие модального окна калькулятора
function openCalculator(id) {
    currentCalculator = calculators.find(calc => calc.id === id);
    if (!currentCalculator) return;
    
    modalTitle.textContent = currentCalculator.title;
    
    // Build form / Построение формы
    calculatorForm.innerHTML = currentCalculator.inputs.map(input => {
        // Check if input has condition
        if (input.condition) {
            // This input will be shown/hidden dynamically
            return '';
        }
        
        if (input.type === 'select') {
            return `
                <div class="form-group">
                    <label class="form-label" for="${input.name}">${input.label}</label>
                    <select class="form-select" id="${input.name}" name="${input.name}">
                        ${input.options.map(opt => 
                            `<option value="${opt.value}" ${input.value == opt.value ? 'selected' : ''}>${opt.text}</option>`
                        ).join('')}
                    </select>
                </div>
            `;
        } else {
            return `
                <div class="form-group">
                    <label class="form-label" for="${input.name}">${input.label}</label>
                    <input 
                        class="form-input" 
                        type="${input.type}" 
                        id="${input.name}" 
                        name="${input.name}"
                        ${input.min !== undefined ? `min="${input.min}"` : ''}
                        ${input.max !== undefined ? `max="${input.max}"` : ''}
                        ${input.step !== undefined ? `step="${input.step}"` : ''}
                        ${input.value !== undefined ? `value="${input.value}"` : ''}
                        required
                    >
                </div>
            `;
        }
    }).join('');
    
    // Add calculate button / Добавление кнопки расчета
    calculatorForm.innerHTML += `
        <button class="calculate-btn" type="button" onclick="calculate()">
            Рассчитать
        </button>
    `;
    
    // Add change listeners for conditional inputs
    setupConditionalInputs();
    
    // Reset result / Сброс результата
    resultValue.textContent = '—';
    
    // Show modal / Показ модального окна
    modal.classList.add('active');
}

// Setup conditional inputs / Настройка условных полей
function setupConditionalInputs() {
    if (!currentCalculator) return;
    
    currentCalculator.inputs.forEach(input => {
        if (input.condition) {
            const dependentElement = document.getElementById(input.name);
            if (dependentElement) {
                // Check condition on change
                calculatorForm.addEventListener('change', () => {
                    const inputs = getFormInputs();
                    const shouldShow = input.condition(inputs);
                    dependentElement.closest('.form-group').style.display = shouldShow ? 'block' : 'none';
                });
            }
        }
    });
}

// Get form inputs / Получение значений формы
function getFormInputs() {
    const inputs = {};
    currentCalculator.inputs.forEach(input => {
        const element = document.getElementById(input.name);
        if (element) {
            inputs[input.name] = input.type === 'number' ? 
                parseFloat(element.value) || 0 : element.value;
        }
    });
    return inputs;
}

// Calculate result / Расчет результата
function calculate() {
    if (!currentCalculator) return;
    
    // Get input values / Получение значений
    const inputs = getFormInputs();
    
    // Validate inputs / Валидация
    let isValid = true;
    currentCalculator.inputs.forEach(input => {
        const element = document.getElementById(input.name);
        if (element && element.required && !element.value) {
            isValid = false;
            element.classList.add('error');
        } else if (element) {
            element.classList.remove('error');
        }
    });
    
    if (!isValid) {
        resultValue.textContent = 'Заполните все поля';
        return;
    }
    
    // Calculate and display result / Расчет и отображение результата
    try {
        const result = currentCalculator.calculate(inputs);
        resultValue.textContent = result;
        resultValue.classList.add('fade-in');
    } catch (error) {
        resultValue.textContent = 'Ошибка расчета';
        console.error('Calculation error:', error);
    }
}

// Setup event listeners / Настройка обработчиков событий
function setupEventListeners() {
    // Theme toggle / Переключение темы
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
    
    // Search / Поиск
    searchInput.addEventListener('input', (e) => {
        renderCalculators(e.target.value);
    });
    
    // Categories / Категории
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            renderCalculators(searchInput.value);
        });
    });
    
    // Modal close / Закрытие модального окна
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Escape key / Клавиша Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Close modal / Закрытие модального окна
function closeModal() {
    modal.classList.remove('active');
    currentCalculator = null;
}

// Start application / Запуск приложения
document.addEventListener('DOMContentLoaded', init);

// Make calculate function global / Сделать функцию calculate глобальной
window.calculate = calculate;

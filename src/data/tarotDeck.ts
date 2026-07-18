export interface TarotCard {
  id: string;
  name: string;
  nameCn: string;
  roman: string;
  symbol: string;
  archetype: string;
  image: string;
  uprightMeaning: string;
  reversedMeaning: string;
  darkAcademiaInsight: string;
}

export const MAJOR_ARCANA: TarotCard[] = [
  {
    id: '0_fool',
    name: 'The Fool',
    nameCn: '愚人',
    roman: '0',
    symbol: '☿',
    archetype: 'Leap of Faith / Spontaneity',
    image: 'cards/0_fool.svg',
    uprightMeaning: '全新的开始、未知的冒犯与无畏的纵身一跃。打破陈旧学界教条的勇气。',
    reversedMeaning: '鲁莽、好高骛远、犹豫不决或逃避现实责任。',
    darkAcademiaInsight: '当你在古老图书馆的最底层翻开未被记录的禁忌手稿时，愚人便是第一步跨出舒适边界的灵魂。他提醒你：完美的准备并不存在，唯有在深渊边缘的纵身一跃，才能开启全新的智识旅程。'
  },
  {
    id: '1_magician',
    name: 'The Magician',
    nameCn: '魔术师',
    roman: 'I',
    symbol: '🜂',
    archetype: 'Willpower / Manifestation',
    image: 'cards/1_magician.svg',
    uprightMeaning: '创造力、主观能动性、全神贯注与资源整合的能力。',
    reversedMeaning: '才华被压抑、灵感阻塞、自我怀疑或技巧滥用。',
    darkAcademiaInsight: '四大元素（火水风土）已然在书桌前齐备：炼金瓶、羊皮纸、鹅毛笔与密契逻辑。魔术师代表你的意志力正在凝聚——此刻你并非缺少灵感或工具，而是需要以专注的心流把无形构想铸为实体。'
  },
  {
    id: '2_high_priestess',
    name: 'The High Priestess',
    nameCn: '女祭司',
    roman: 'II',
    symbol: '☾',
    archetype: 'Intuition / Unconscious Knowledge',
    image: 'cards/2_high_priestess.svg',
    uprightMeaning: '直觉、潜意识、沉默的智慧与向内探索。',
    reversedMeaning: '偏见、焦虑、忽视内心声音或过度依赖外部肯定。',
    darkAcademiaInsight: '她坐于双柱（B & J）之间，手捧禁书 Scroll（Tora）。女祭司掌管着逻辑与理性触及不到的隐秘领域。如果你的代码或思考陷入逻辑死锁，请闭上眼，聆听直觉在潜意识深渊中敲击的回响。'
  },
  {
    id: '3_empress',
    name: 'The Empress',
    nameCn: '皇后',
    roman: 'III',
    symbol: '♀',
    archetype: 'Abundance / Creative Flow',
    image: 'cards/3_empress.svg',
    uprightMeaning: '丰饶、孕育新思想、艺术灵感与滋养生长。',
    reversedMeaning: '思维枯竭、过度沉溺、创造力瓶颈。',
    darkAcademiaInsight: '在常春藤缠绕的古老中庭，皇后象征着源源不绝的创造生命力。她告诉你：严苛的自我批判有时会杀死稚嫩的萌芽。给你的想法一些自由呼吸与丰盈滋养的空间，它们定能繁茂如林。'
  },
  {
    id: '4_emperor',
    name: 'The Emperor',
    nameCn: '皇帝',
    roman: 'IV',
    symbol: '♂',
    archetype: 'Structure / Rational Order',
    image: 'cards/4_emperor.svg',
    uprightMeaning: '秩序、系统化架构、自律与坚定的边界感。',
    reversedMeaning: '控制欲过强、架构僵化、固执己见或面临权威失控。',
    darkAcademiaInsight: '皇帝手握权杖，代表宏伟系统的底层架构师。当无序的混乱侵蚀你的心智时，你需要像修缮大教堂穹顶一样，重新确立严谨的法则、模块划分与不可动摇的自我边界。'
  },
  {
    id: '5_hierophant',
    name: 'The Hierophant',
    nameCn: '教皇',
    roman: 'V',
    symbol: '♉',
    archetype: 'Tradition / Institutional Wisdom',
    image: 'cards/5_hierophant.svg',
    uprightMeaning: '传统智慧、学术传承、导师指引与精神信仰。',
    reversedMeaning: '教条主义、墨守成规、反叛权威。',
    darkAcademiaInsight: '教皇象征着沉淀了千年的经典教条与先哲遗产。并非所有问题都需要从零造轮子，去翻阅那些经过岁月洗礼的经典范式与学术根基，站在巨人的肩膀上往往是解题的钥匙。'
  },
  {
    id: '6_lovers',
    name: 'The Lovers',
    nameCn: '恋人',
    roman: 'VI',
    symbol: '♊',
    archetype: 'Alignment / Moral Choice',
    image: 'cards/6_lovers.svg',
    uprightMeaning: '价值观共鸣、关键抉择、深度契合与合作共赢。',
    reversedMeaning: '选择纠结、内在冲突、分歧与信任危机。',
    darkAcademiaInsight: '恋人不仅是情感羁绊，更是智识与价值观的分水岭。在黑夜的书房里，你正面临一条岔路：是选择平庸而安稳的既有方案，还是选择那个让你心跳加速、完美契合你美学执念的高难道路？'
  },
  {
    id: '7_chariot',
    name: 'The Chariot',
    nameCn: '战车',
    roman: 'VII',
    symbol: '♋',
    archetype: 'Willpower over Obstacles',
    image: 'cards/7_chariot.svg',
    uprightMeaning: '克服逆境、绝对专注、行动力与驾驭二元对立。',
    reversedMeaning: '方向失控、动力衰竭、遇到无法逾越的障壁。',
    darkAcademiaInsight: '一黑一白双狮身人面兽向相反方向撕扯，唯有驭手冷静的意志才能让战车轰鸣向前。这是对内耗与多任务干扰的终极宣战：收束心神，把所有矛盾的思绪凝聚成一股击穿阻碍的动能。'
  },
  {
    id: '8_strength',
    name: 'Strength',
    nameCn: '力量',
    roman: 'VIII',
    symbol: '♌',
    archetype: 'Compassionate Resilience',
    image: 'cards/8_strength.svg',
    uprightMeaning: '内在勇气、温柔的坚韧、以柔克刚与耐心自持。',
    reversedMeaning: '自卑、自我怀疑、情绪失控或用力过猛。',
    darkAcademiaInsight: '真正的高阶力量并非狂暴的压制，而是像少女抚慰雄狮般，用宁静与耐心安抚自己内在的狂躁与焦虑。当你以包容之心面对代码中的残缺与自我认知的阴影，阻碍将自愿为你驯服。'
  },
  {
    id: '9_hermit',
    name: 'The Hermit',
    nameCn: '隐士',
    roman: 'IX',
    symbol: '♍',
    archetype: 'Solitude / Inner Lantern',
    image: 'cards/9_hermit.svg',
    uprightMeaning: '独处思考、深度自省、远离喧嚣与寻找内心的灯塔。',
    reversedMeaning: '孤立无援、偏执封闭、迷失方向。',
    darkAcademiaInsight: '隐士提着真理之灯，独自在雪夜登顶。在被信息狂轰滥炸的现代世界中，你需要一次彻底的“断网自闭”与精神深潜。最深邃的启示永远诞生于一个人在烛光下的孤独沉思中。'
  },
  {
    id: '10_wheel_of_fortune',
    name: 'Wheel of Fortune',
    nameCn: '命运之轮',
    roman: 'X',
    symbol: '🜃',
    archetype: 'Cycles / Inevitable Change',
    image: 'cards/10_wheel_of_fortune.svg',
    uprightMeaning: '周期循环、转折点、机遇与顺应命运的浪潮。',
    reversedMeaning: '遭遇低谷、抗拒变革、运势不佳。',
    darkAcademiaInsight: '如同古典天文钟上的齿轮咬合与潮起潮落，人与项目的状态自有其周期。处于巅峰时勿忘谦卑，处于代码停滞或情绪低谷时也不必绝望——命运之轮已在暗中旋转，拐点即将来临。'
  },
  {
    id: '11_justice',
    name: 'Justice',
    nameCn: '正义',
    roman: 'XI',
    symbol: '♎',
    archetype: 'Truth / Cause and Effect',
    image: 'cards/11_justice.svg',
    uprightMeaning: '客观理性、因果互现、公正审视与清晰断定。',
    reversedMeaning: '主观偏见、自欺欺人、因果反噬或失衡。',
    darkAcademiaInsight: '正义女神左手持天平，右手举利剑。任何 Bug 与系统问题，或是心理上的纠葛，都遵循着最客观的因果律。抛开情绪化的借口与侥幸心理，用最严密理性的逻辑审视源头，真理立现。'
  },
  {
    id: '12_hanged_man',
    name: 'The Hanged Man',
    nameCn: '倒吊人',
    roman: 'XII',
    symbol: '🜄',
    archetype: 'Surrender / New Perspective',
    image: 'cards/12_hanged_man.svg',
    uprightMeaning: '主动停顿、逆向思维、牺牲短期利益换取更高顿悟。',
    reversedMeaning: '无意义的消耗、执迷不悟、挣扎于困境之中。',
    darkAcademiaInsight: '倒吊人自愿被悬挂在世界之树上，头部周围泛着顿悟的黄金光环。当现有视角走进死胡同时，任何强力推行都是徒劳。倒转过来，让惯性思维完全暂停，从反方向或极端的边缘重新打量世界。'
  },
  {
    id: '13_death',
    name: 'Death',
    nameCn: '死神',
    roman: 'XIII',
    symbol: '♏',
    archetype: 'Transformation / Profound Rebirth',
    image: 'cards/13_death.svg',
    uprightMeaning: '旧范式的死灭、彻底重构、告别过去与涅槃重生。',
    reversedMeaning: '贪恋旧物、害怕改变、停滞在不可挽回的执念中。',
    darkAcademiaInsight: '死神并非物理生命的终结，而是“旧我”与“技术债”的无情收割者。要让新的生命力在废墟上开花，就必须有勇气把腐朽的代码、错误的产品架构或内耗的心结连根拔起。'
  },
  {
    id: '14_temperance',
    name: 'Temperance',
    nameCn: '节制',
    roman: 'XIV',
    symbol: '♐',
    archetype: 'Alchemy / Synthesis of Opposites',
    image: 'cards/14_temperance.svg',
    uprightMeaning: '炼金调和、平衡二元对立、节制与内在同化。',
    reversedMeaning: '极端偏执、失衡、过度消耗与情绪动荡。',
    darkAcademiaInsight: '大天使在两只圣杯之间来回倾倒着流体黄金，实现完美的炼金融合。技术与艺术、速度与质量、理性与感性——真正的智者绝非走极端，而是在看似矛盾的两端之间调配出绝妙的动态平衡。'
  },
  {
    id: '15_devil',
    name: 'The Devil',
    nameCn: '恶魔',
    roman: 'XV',
    symbol: '♑',
    archetype: 'Shadow Self / Material Bondage',
    image: 'cards/15_devil.svg',
    uprightMeaning: '执念、虚荣束缚、物质诱惑、审视潜意识阴影。',
    reversedMeaning: '挣脱精神枷锁、看清诱惑本质、重获自由。',
    darkAcademiaInsight: '恶魔牌揭露了将你囚禁在石柱上的铁链其实极其宽松，你随时可以走开。你在追求什么？是完美主义的虚荣、被认可的焦虑，还是僵化的技术执念？直面你的潜意识阴影，锁链即刻化为灰烬。'
  },
  {
    id: '16_tower',
    name: 'The Tower',
    nameCn: '高塔',
    roman: 'XVI',
    symbol: '♂',
    archetype: 'Sudden Awakening / Collapse of Illusions',
    image: 'cards/16_tower.svg',
    uprightMeaning: '突发剧变、既有认知坍塌、刺破虚妄幻象、闪电般的警醒。',
    reversedMeaning: '勉强维持幻象、推迟崩溃、内心极度不安。',
    darkAcademiaInsight: '闪电击穿了巴别塔的尖顶，皇冠坠落入无尽黑夜。当建立在错误假设上的庞大架构崩溃时，痛苦是剧烈的，但更是无上幸运的——高塔摧毁了虚假的围墙，让你第一次直视最真实的天空。'
  },
  {
    id: '17_star',
    name: 'The Star',
    nameCn: '星星',
    roman: 'XVII',
    symbol: '♒',
    archetype: 'Hope / Inspiration / Serenity',
    image: 'cards/17_star.svg',
    uprightMeaning: '希望、灵感如泉涌、内心疗愈、清澈的愿景与启示。',
    reversedMeaning: '希望破灭、悲观沮丧、灵感枯竭或自我封闭。',
    darkAcademiaInsight: '高塔倒塌后的浩渺夜空中，天狼星闪烁着永恒的水晶微芒。裸体女神将甘露倒入星河。此刻所有喧嚣散去，你的灵感前所未有地清澈——信任你内心深处真诚而纯粹的设计初心。'
  },
  {
    id: '18_moon',
    name: 'The Moon',
    nameCn: '月亮',
    roman: 'XVIII',
    symbol: '♓',
    archetype: 'Illusion / Dreams / Subconscious Depths',
    image: 'cards/18_moon.svg',
    uprightMeaning: '直觉波动、潜在的迷雾、迷茫与情绪投影。',
    reversedMeaning: '迷雾散去、看清真相、克服无名的恐惧。',
    darkAcademiaInsight: '在惨淡的苍蓝月光下，野狼与家犬在深渊边缘吠叫。你正穿越迷雾重重的未知水域，这里充满了不确定性与没有文档的代码暗礁。不要用僵化的视觉去分辨，用心眼去感知潜在的流动。'
  },
  {
    id: '19_sun',
    name: 'The Sun',
    nameCn: '太阳',
    roman: 'XIX',
    symbol: '☉',
    archetype: 'Vitality / Joy / Radiant Enlightenment',
    image: 'cards/19_sun.svg',
    uprightMeaning: '光明、活力十足、绝对的喜悦、彻底的领悟与成功。',
    reversedMeaning: '暂时被遮挡的热情、精力下滑、过度乐观。',
    darkAcademiaInsight: '金色太阳升上古典砖墙之巅，向日葵怒放。这是暗黑学院漫长冬夜后最炙热的学术顿悟与产品诞生的喜悦。困扰已久的迷雾消散殆尽，你的智慧与热忱正熠熠生辉，耀眼不可阻挡。'
  },
  {
    id: '20_judgement',
    name: 'Judgement',
    nameCn: '审判',
    roman: 'XX',
    symbol: '♇',
    archetype: 'Reckoning / Absolution / Calling',
    image: 'cards/20_judgement.svg',
    uprightMeaning: '觉醒的号角、复盘重估、内在召回与使命感。',
    reversedMeaning: '逃避自省、悔恨过去、害怕接受评估结果。',
    darkAcademiaInsight: '大天使号角声在古老圣堂中吹响，逝去的灵魂自棺木中苏醒。这是一个极其庄重的复盘时刻：重新审视你过去写下的每一行代码、每一次选择，并在良知的审判下轻装上阵，迎来精神升华。'
  },
  {
    id: '21_world',
    name: 'The World',
    nameCn: '世界',
    roman: 'XXI',
    symbol: '♄',
    archetype: 'Completion / Cosmic Harmony',
    image: 'cards/21_world.svg',
    uprightMeaning: '圆满达成、完整统一、完美的闭环与新征程的前奏。',
    reversedMeaning: '临门一脚的拖延、未完成的执念、局部完美而全局缺陷。',
    darkAcademiaInsight: '桂冠圆环之中，舞者在宇宙核心优雅回转，四大元素守护于四隅。这是大阿卡纳旅程的终极圆满——你的系统闭环完美运作，所有模块融合为统一的有机体。在一个循环结束之际，新世界的大门已为你开启。'
  }
];

/**
 * Helper to randomly draw `count` cards with upright/reversed states
 */
export interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  positionLabel: string;
  positionInsight: string;
}

const SPREAD_POSITIONS = [
  { label: '第一张 · 执念 (The Past / Shadow)', insight: '过往积压的习气、潜意识的执念或长期掣肘你的根本症结' },
  { label: '第二张 · 当下 (The Present / Illusion)', insight: '目前困境的表象、正在经历的拉扯或摆在你面前的真实格局' },
  { label: '第三张 · 钥匙 (The Future / Key)', insight: '打破僵局的密契钥匙、灵感的突破口或通往下一阶段的指引' }
];

export function getRandomSpread(count: number = 3): DrawnCard[] {
  const shuffled = [...MAJOR_ARCANA];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count).map((card, index) => {
    const isReversed = Math.random() < 0.35; // 35% chance of being reversed
    return {
      card,
      isReversed,
      positionLabel: SPREAD_POSITIONS[index]?.label || `第 ${index + 1} 张`,
      positionInsight: SPREAD_POSITIONS[index]?.insight || ''
    };
  });
}

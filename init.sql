-- 河海大学110周年校庆数据库初始化脚本

-- 创建数据库
CREATE DATABASE IF NOT EXISTS hohai110 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE hohai110;

-- 插入时间线事件示例数据
INSERT INTO timeline_events (year, title, description, category, isMajor, achievements, images, createdAt, updatedAt) VALUES
(1915, '河海工程专门学校成立', '张闻天、茅以升等著名学者创办河海工程专门学校，开启中国水利高等教育先河。', 'milestone', true,
 JSON_ARRAY('中国第一所水利高等学府', '创立水利工程专业教育体系', '培养首批水利工程人才'),
 JSON_ARRAY(), NOW(), NOW()),

(1952, '华东水利学院成立', '全国院系调整，学校更名为华东水利学院，成为水利部直属高校。', 'milestone', true,
 JSON_ARRAY('成为新中国重点建设的水利院校', '确立水利特色办学方向'),
 JSON_ARRAY(), NOW(), NOW()),

(1985, '恢复河海大学校名', '学校恢复传统校名"河海大学"，进入新的发展时期。', 'milestone', true,
 JSON_ARRAY('恢复传统校名', '扩大办学规模', '提升学科建设水平'),
 JSON_ARRAY(), NOW(), NOW()),

(2005, '进入"211工程"重点建设高校', '河海大学成功进入国家"211工程"重点建设高校行列。', 'achievement', true,
 JSON_ARRAY('国家重点建设高校', '学科建设跨越式发展'),
 JSON_ARRAY(), NOW(), NOW()),

(2017, '入选国家"双一流"建设高校', '河海大学水利工程、环境科学与工程入选世界一流学科建设名单。', 'achievement', true,
 JSON_ARRAY('世界一流学科建设', '国际影响力显著提升'),
 JSON_ARRAY(), NOW(), NOW()),

(2025, '百十华诞', '河海大学迎来建校110周年，续写新时代辉煌篇章。', 'milestone', true,
 JSON_ARRAY('百十年薪火相传', '培养数十万优秀人才', '服务国家水利事业'),
 JSON_ARRAY(), NOW(), NOW());

-- 插入接力活动示例数据
INSERT INTO relay_activities (title, description, status, startDate, endDate, image, createdAt, updatedAt) VALUES
('百十校庆祝福接力', '让我们一起为母校百十华诞送上最美好的祝福！', 'ongoing', '2025-01-01', '2025-12-31', NULL, NOW(), NOW()),
('校友故事征集', '分享你与河海的故事，记录那些难忘的时光。', 'ongoing', '2025-01-01', '2025-12-31', NULL, NOW(), NOW()),
('母校印象摄影展', '用镜头记录河海之美，展现母校风采。', 'upcoming', '2025-03-01', '2025-06-30', NULL, NOW(), NOW());

-- 插入文章示例数据
INSERT INTO articles (title, content, summary, coverImage, category, status, views, authorId, publishedAt, tags, createdAt, updatedAt) VALUES
('河海大学110周年校庆隆重举行',
'2025年10月19日，河海大学迎来了110周年华诞。校庆大会在江宁校区体育馆隆重举行，来自海内外的万余名校友齐聚一堂，共同庆祝母校的生日。\n\n校长在致辞中回顾了河海大学110年的光辉历程，从1915年河海工程专门学校的创立，到如今成为世界一流学科建设高校，河海大学始终坚持"艰苦朴素，实事求是，严格要求，勇于探索"的校训精神。\n\n本次校庆活动包括校史展览、学术论坛、文艺晚会等多项精彩内容，充分展现了河海大学的深厚底蕴和时代风采。',
'河海大学迎来110周年华诞，万余名校友齐聚母校共庆盛典。',
'/uploads/articles/anniversary.jpg',
'校庆动态',
'published',
1520,
1,
NOW(),
JSON_ARRAY('校庆', '110周年', '庆典'),
NOW(), NOW()),

('百年河海：水利工程的摇篮',
'河海大学是中国第一所培养水利人才的高等学府，被誉为"水利高层次创新创业人才培养的摇篮"。\n\n建校110年来，学校培养了近30万名毕业生，其中包括数十位两院院士、众多水利水电工程专家和行业领军人才。河海校友活跃在国内外水利水电战线，为中国乃至世界的水利事业做出了重要贡献。\n\n从三峡工程、南水北调到港珠澳大桥，从国内重大水利工程到"一带一路"水利项目，处处都有河海人的身影。',
'河海大学110年培养近30万毕业生，为水利事业输送大批人才。',
'/uploads/articles/education.jpg',
'校史回顾',
'published',
890,
1,
NOW(),
JSON_ARRAY('校史', '水利工程', '人才培养'),
NOW(), NOW()),

('世界一流学科建设成果展示',
'河海大学水利工程、环境科学与工程两个学科入选国家"双一流"建设学科名单，标志着学校学科建设迈上新台阶。\n\n水利工程学科在全国第四轮学科评估中获得A+等级，连续多年保持领先地位。学校在水文水资源、水工结构、水力学及河流动力学等领域取得了一系列重要研究成果。\n\n环境科学与工程学科聚焦水环境保护与治理、生态修复等前沿领域，为国家生态文明建设提供了重要科技支撑。',
'河海大学两个学科入选"双一流"建设，学科实力显著提升。',
'/uploads/articles/discipline.jpg',
'学科建设',
'published',
654,
1,
NOW(),
JSON_ARRAY('双一流', '学科建设', '科研成果'),
NOW(), NOW()),

('校友风采：那些改变世界的河海人',
'在河海大学110年的发展历程中，涌现出了一大批杰出校友，他们在各自的领域取得了卓越成就。\n\n钱正英院士，中国水利水电事业的开拓者之一，主持了南水北调等重大工程的规划工作；汪恕诚院士，曾任水利部部长，为中国水利事业发展做出重要贡献；张建云院士，在水文水资源领域成就斐然...\n\n这些优秀校友的事迹激励着一代又一代河海学子，传承着"上善若水"的河海精神。',
'河海大学杰出校友在各领域取得卓越成就，传承河海精神。',
'/uploads/articles/alumni.jpg',
'校友风采',
'published',
1100,
1,
NOW(),
JSON_ARRAY('校友', '风采', '事迹'),
NOW(), NOW());

-- 插入祝福示例数据
INSERT INTO blessings (content, userId, authorName, graduationYear, department, status, likes, isAnonymous, createdAt, updatedAt) VALUES
('祝母校110周年生日快乐！百十河海，薪火相传，愿母校在新时代续写辉煌篇章！', 1, '张明', 2015, '水利水电学院', 'approved', 128, false, NOW(), NOW()),

('上善若水，水善利万物而不争。感谢母校的培养，祝河海大学越办越好，培养更多优秀人才！', 1, '李华', 2010, '环境学院', 'approved', 95, false, NOW(), NOW()),

('在河海度过的四年是我人生中最美好的时光，祝母校桃李满天下，再创新辉煌！', 1, '王芳', 2018, '土木与交通学院', 'approved', 76, false, NOW(), NOW()),

('作为一名河海人，我为母校感到骄傲！祝河海大学110周年生日快乐，永远年轻！', 1, '匿名校友', NULL, NULL, 'approved', 52, true, NOW(), NOW()),

('百年河海，水利摇篮。祝母校在"双一流"建设中再创佳绩，为国家培养更多栋梁之材！', 1, '陈杰', 2012, '水文水资源学院', 'approved', 88, false, NOW(), NOW()),

('感恩母校的培养，祝河海大学110周年校庆圆满成功！河海精神永远激励着我们前行！', 1, '刘洋', 2016, '计算机与信息学院', 'approved', 63, false, NOW(), NOW()),

('祝福母校生日快乐！愿河海大学在新征程上乘风破浪，培养更多服务国家水利事业的优秀人才！', 1, '匿名校友', NULL, NULL, 'approved', 45, true, NOW(), NOW()),

('百十华诞，再谱新篇！祝母校桃李芬芳，学术昌盛，为建设世界一流大学而努力奋斗！', 1, '周敏', 2014, '商学院', 'approved', 71, false, NOW(), NOW());

-- 插入评论示例数据（关联到文章）
INSERT INTO comments (content, articleId, userId, parentId, status, likes, createdAt, updatedAt) VALUES
('写得真好！作为河海校友，看到母校的发展感到非常自豪！', 1, 1, NULL, 'approved', 24, NOW(), NOW()),

('我也参加了校庆活动，现场气氛非常热烈，真的很感动！', 1, 1, NULL, 'approved', 18, NOW(), NOW()),

('同感！那天的文艺晚会特别精彩，很多节目都让人热泪盈眶。', 1, 1, 2, 'approved', 12, NOW(), NOW()),

('河海大学在水利领域的贡献真的很大，为母校点赞！', 2, 1, NULL, 'approved', 32, NOW(), NOW()),

('期待母校在"双一流"建设中取得更大成就！', 3, 1, NULL, 'approved', 15, NOW(), NOW()),

('这些校友前辈都是我们学习的榜样，向他们致敬！', 4, 1, NULL, 'approved', 28, NOW(), NOW()),

('河海精神代代相传，我们要继续努力，为母校争光！', 4, 1, NULL, 'approved', 20, NOW(), NOW());

-- 注意：以下功能已移除，相关示例数据已删除
-- - 校友分布地图 (alumni_locations)
-- - 海报下载 (posters)
-- - 拼图游戏 (mosaics)

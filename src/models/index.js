const sequelize = require('../config/database');

// Import models
const User = require('./User');
const TimelineEvent = require('./TimelineEvent');
const RelayActivity = require('./RelayActivity');
const RelayParticipation = require('./RelayParticipation');
const Maxim = require('./Maxim');
const MaximLike = require('./MaximLike');
const AlumniLocation = require('./AlumniLocation');
const Poster = require('./Poster');
const Mosaic = require('./Mosaic');
const MosaicProgress = require('./MosaicProgress');
const Article = require('./Article');
const Comment = require('./Comment');
const Blessing = require('./Blessing');
const Visitor = require('./Visitor');
const FutureMessage = require('./FutureMessage');
const Torch = require('./Torch');
const Forum = require('./Forum');
const ForumPost = require('./ForumPost');
const ForumReply = require('./ForumReply');
const ForumLike = require('./ForumLike');
const SystemConfig = require('./SystemConfig');
const VerificationCode = require('./VerificationCode');

// Define associations
User.hasMany(RelayParticipation, { foreignKey: 'userId', as: 'relayParticipations' });
RelayParticipation.belongsTo(User, { foreignKey: 'userId', as: 'user' });

RelayActivity.hasMany(RelayParticipation, { foreignKey: 'activityId', as: 'participations' });
RelayParticipation.belongsTo(RelayActivity, { foreignKey: 'activityId', as: 'activity' });

User.hasMany(Maxim, { foreignKey: 'userId', as: 'maxims' });
Maxim.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.belongsToMany(Maxim, { through: MaximLike, foreignKey: 'userId', as: 'likedMaxims' });
Maxim.belongsToMany(User, { through: MaximLike, foreignKey: 'maximId', as: 'likedByUsers' });

User.hasMany(MosaicProgress, { foreignKey: 'userId', as: 'mosaicProgress' });
MosaicProgress.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Mosaic.hasMany(MosaicProgress, { foreignKey: 'mosaicId', as: 'userProgress' });
MosaicProgress.belongsTo(Mosaic, { foreignKey: 'mosaicId', as: 'mosaic' });

// Article associations
User.hasMany(Article, { foreignKey: 'authorId', as: 'articles' });
Article.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

Article.hasMany(Comment, { foreignKey: 'articleId', as: 'comments', onDelete: 'CASCADE' });
Comment.belongsTo(Article, { foreignKey: 'articleId', as: 'article' });

User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Comment.hasMany(Comment, { foreignKey: 'parentId', as: 'replies', onDelete: 'CASCADE' });
Comment.belongsTo(Comment, { foreignKey: 'parentId', as: 'parent' });

// Blessing associations
User.hasMany(Blessing, { foreignKey: 'userId', as: 'blessings' });
Blessing.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// FutureMessage associations
User.hasMany(FutureMessage, { foreignKey: 'userId', as: 'futureMessages' });
FutureMessage.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Forum associations
Forum.hasMany(ForumPost, { foreignKey: 'forumId', as: 'posts', onDelete: 'CASCADE' });
ForumPost.belongsTo(Forum, { foreignKey: 'forumId', as: 'forum' });

User.hasMany(ForumPost, { foreignKey: 'userId', as: 'forumPosts' });
ForumPost.belongsTo(User, { foreignKey: 'userId', as: 'user' });

ForumPost.hasMany(ForumReply, { foreignKey: 'postId', as: 'replies', onDelete: 'CASCADE' });
ForumReply.belongsTo(ForumPost, { foreignKey: 'postId', as: 'post' });

User.hasMany(ForumReply, { foreignKey: 'userId', as: 'forumReplies' });
ForumReply.belongsTo(User, { foreignKey: 'userId', as: 'user' });

ForumReply.hasMany(ForumReply, { foreignKey: 'parentId', as: 'childReplies', onDelete: 'CASCADE' });
ForumReply.belongsTo(ForumReply, { foreignKey: 'parentId', as: 'parentReply' });

User.hasMany(ForumLike, { foreignKey: 'userId', as: 'forumLikes' });
ForumLike.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  TimelineEvent,
  RelayActivity,
  RelayParticipation,
  Maxim,
  MaximLike,
  AlumniLocation,
  Poster,
  Mosaic,
  MosaicProgress,
  Article,
  Comment,
  Blessing,
  Visitor,
  FutureMessage,
  Torch,
  Forum,
  ForumPost,
  ForumReply,
  ForumLike,
  SystemConfig,
  VerificationCode
};

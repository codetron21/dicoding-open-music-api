const Joi = require("joi");

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().positive().required(),
});

const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().positive().required().max(new Date().getFullYear()),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number().positive(),
  albumId: Joi.string(),
});

const SongQuerySchema = Joi.object({
  title: Joi.string(),
  performer: Joi.string(),
});

module.exports = { AlbumPayloadSchema, SongPayloadSchema,SongQuerySchema  };

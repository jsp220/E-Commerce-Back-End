const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  try {
    const TagData = await Tag.findAll({
      // be sure to include its associated Product data
      include: [
        {
          model: Product,
          through: ProductTag
        }
      ]
    });

    res.status(200).json(TagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      // be sure to include its associated Product data
      include: [
        {
          model: Product,
          through: ProductTag
        }
      ]
    });

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  Tag.create(req.body)
    .then((tag) => {
      if (req.body.productIds.length) {
        const productTagIdArr = req.body.productIds.map((product_id) => {
          return {
            product_id,
            tag_id: tag.id
          }
        });
        return [tag, ProductTag.bulkCreate(productTagIdArr)];
      }
      res.status(200).json(tag);
    })
    .then((tag, productTagIds) => res.status(200).json(tag[0]))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  try {
    const tagData = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      }
    })
    res.status(200).json({message: "Tag successfully updated."});
  } catch (err) {
    res.status(400).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const deletedTag = await Tag.destroy({
      where: {
        id: req.params.id
      }
    });

    if (!deletedTag) {
      res.status(404).json({ message: "No tag found with this id"});
      return;
    };

    res.status(200).json({ message: "Tag successfully deleted."});
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;

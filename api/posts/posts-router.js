// implement your posts router here
const express = require('express');
const Posts = require('./posts-model');

const router = express.Router();


// POSTS ENDPOINTS

router.get('/', (req, res) => {
    Posts.find()
    .then(posts => {
        res.status(200).json(posts);
    })
    .catch(err => {
        res.status(500).json({ message: "The posts information could not be retrieved"});
    })
})


router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
    .then(post => {
      if(!post) {
        res.status(404).json({ message: "The post with the specified ID does not exist"});
      }
      res.status(200).json(post);
    })
    .catch(err => {
        res.status(500).json({ message: "The post information could not be retrieved"});
    })
})

router.post('/', (req, res) => {
    const post = req.body;
    if(!post.title || !post.contents) {
        res.status(400).json({ message: "Please provide title and contents for the post"});
    } else {
        Posts.insert(post)
        .then(({id}) => {
           return Posts.findById(id);
        })
        .then(createdPost => {
            res.status(201).json(createdPost);
        })
        .catch(err => {
            res.status(500).json({ message: "There was an error while saving the post to the database"});
        })
    }
})


router.put('/:id', async (req, res) => {
     const {title, contents} = req.body;
    if(!title || !contents) {
       res.status(400).json({message: "Please provide title and contents for the post"});
    } else {
        return Posts.findById(req.params.id)
        .then(stuff => {
            if(!stuff) {
               res.status(404).json({ message: "The post with the specified ID does not exist"});
            } else {
               return Posts.update(req.params.id, req.body)
            }
        })
        .then(data => {
            if(data) {
                return Posts.findById(req.params.id);
            }
        })
        .then(updatedPost => {
            if(updatedPost) {
                res.status(200).json(updatedPost);
            }
        })
        .catch(err => {
            res.status(500).json({ message: "The post information could not be retrieved"});
        })
    }

})

router.delete('/:id', async (req, res) => {
    try {
    const possiblePost = await Posts.findById(req.params.id);
    if(!possiblePost) {
        res.status(404).json({ message: "The post with the specified ID does not exist"});
    }
    else {
          await Posts.remove(req.params.id);
          res.status(200).json(possiblePost);
    }
}  catch(err) {
    res.status(500).json({ message: "The post could not be removed"});
}

})


router.get('/:id/comments', async (req, res) => {
   try {
        const possiblePost = await Posts.findbyId(req.params.id);
        if(!possiblePost) {
            res.status(404).json({ message: "The post with the specified ID does not exist"});
        }
        else {
            const comments =  await  Posts.findPostComments(req.params.id);
            res.status(200).json(comments);

        }
   }  catch(err) {
         res.status(500).json({ message: "The comments information could not be retrieved"});
   }
})































module.exports = router;
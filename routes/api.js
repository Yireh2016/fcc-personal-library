/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var ObjectId = require('mongodb').ObjectId;

module.exports = function (app,db) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
     let dbTest = db.db("fcc");

      dbTest.collection("books").find({}).toArray((err, docs) => {
        if(err){
          res.json({error:"erron obtenierndo books",obj:JSON.stringify(err)})
          return
        }
        
        if(docs.length>0){
          res.json(docs)
        }
        
        
      })
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(function (req, res){
      var {title,comment} = req.body;
    
      if(title=== "" || !title){
        res.send("missing title")
        return
      }
    
    if(!comment){
      comment=[]
    }
      let dbTest = db.db("fcc");
    const date=new Date()
    const data={title,comment,_id:date.getTime().toString()}
      dbTest.collection("books").insertOne(data,(err,doc)=>{
        if(err){
          console.error("error on post book ",err)
          res.json({error:'error on post book'})
        }
        
        let {
          _id,
          title,
        } = doc.ops[0];
        
        const result={_id,title}
        res.json(result);
        
      })
    
    
    //response will contain new book object including atleast _id and title
    })
  
    .delete((req,res)=>{
    
    let dbTest=db.db('fcc')
    dbTest.collection('books').deleteMany({},(err,doc)=>{
      if(err){
        res.json({error:"no se pudo borrar todo"})
        return
      }
      console.log("todo se borro")
      res.send("complete delete successful")
    }) 
  })
    
//     .delete(function(req, res){
//       //if successful response will be 'complete delete successful'
   
//     });



  app.route('/api/books/:id')
    .get(function (req, res){
      var bookid = req.params.id;
    
      let dbTest = db.db("fcc");

        dbTest.collection("books").find({_id:bookid}).toArray((err, docs) => {
          if(err){
            res.json({error:"erron obtenierndo books",obj:JSON.stringify(err)})
            return
          }

          if(docs.length>0){
            const {title,_id,comment}=docs[0]
            const response={title,_id,commentCount:comment.length}
            res.json(response)
            return
          }
                res.send("no book exists")



        })
    
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(function(req, res){
      var bookid = req.params.id;
      var comment = req.body.comment;
      //json res format same as .get
    
      let dbTest=db.db("fcc")
      dbTest.collection('books').updateOne({_id:bookid},{$push:{comment}},(err,docs)=>{
        if(err){
          res.json({error:"error post books id",msg:err})
          return
        }

        if(docs.modifiedCount>0){
          dbTest.collection('books').find({_id:bookid}).toArray((err,doc)=>{
             if(err){
              res.json({error:"error post books id",msg:err})
              return
            }
            res.json(doc);
            return
          })
          return
        } 
      })
  })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //json res format same as .get
    
      let dbTest=db.db("fcc")
      dbTest.collection("books").deleteOne({_id:bookid},(err,doc)=>{
        
         if(err){
        //error al borrar
        res.json('could not delete '+bookid)
        return
      }      
      
      if(doc.deletedCount > 0 ){
        //borro
        res.send('delete successful')
        return
      }
      //no borro nada
      res.text('missing title')
        
      })
    
    });
  
};

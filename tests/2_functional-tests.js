/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  // test('#example Test GET /api/books', function(done){
  //    chai.request(server)
  //     .get('/api/books')
  //     .end(function(err, res){
  //       assert.equal(res.status, 200);
  //       assert.isArray(res.body, 'response should be an array');
  //       assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
  //       assert.property(res.body[0], 'title', 'Books in array should contain title');
  //       assert.property(res.body[0], '_id', 'Books in array should contain _id');
  //       done();
  //     });
  // });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        
           chai
          .request(server)
          .post(`/api/books`)
          .send({
            title: "book"
          })
          .end((err, res) => {
             if(err){
               done();
               return
             }
            assert.equal(res.body.title, "book");
            assert.exists(res.body._id);
            done();
          })
        
        
      });
      
      test('Test POST /api/books with no title given', function(done) {
       
        
        chai
          .request(server)
          .post(`/api/books`)
          .send({
            title: ""
          })
          .end((err, res) => {
             if(err){
               done();
               return
             }
            assert.equal(res.text, "missing title");
            done();
          })
        
        
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        
        const title="El mio Cid";
         chai
          .request(server)
          .post(`/api/books`)
          .send({
            title
          })
          .end((err, res) => {
             if(err){
               console.error('error subiendo el mio  cid',err)
               done();
               return
             }
            
            const title="El mio Cid";
             chai
              .request(server)
              .get(`/api/books`)
              .end((err,res)=>{
               const docs=res.body
               assert.property(docs[0],'title')
               assert.property(docs[0],'comment')
               done()
             })

          })
        
        
      });      
      
    });


    suite('DELETE I can delete /api/books/ to delete all', function(){
      test("test DELETE api/books/ to delete all 'complete delete successful' ",(done)=>{
        
        chai
        .request(server)
        .delete('api/books')
        .end((err,res)=>{
          if(err){
            done()
            return
          }
          console.log("res",res.hasOwnProperty('text'))
          assert.equal(res.text,"complete delete successful")
          done()
        })
      })
    })
      
      
    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
          chai
          .request(server)
          .get(`/api/books/`+'321654')
          .send()
          .end((err,res)=>{ 
          if(err){
            done()
            return
          }
               assert.equal(res.text, "no book exists");
            done()
          })
            
            
            
            
          });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
          chai
          .request(server)
          .post(`/api/books`)
          .send({
            title:"El sr de los anillos"
          })
          .end((err,res)=>{

            if(err){
              done()
              return;
            }
            
            const idFromPots=res.body._id
            
                chai
              .request(server)
              .get(`/api/books/${idFromPots}`)
            .end((err,res)=>{
              if(err){
                done()
                return
              }
                  const {_id}=res.body
                  assert.equal(_id,idFromPots)
                  done()
                  return
                })
          })
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai
        .request(server)
        .post(`/api/books`)
        .send({
          title:"test api books w/ comments"
        })
        .end((err,res)=>{
          if(err)done()
          const idFromPost=res.body._id;
          chai
          .request(server)
          .post(`api/books/`+idFromPost)
          .send({
            comment:"unique comment"
          })
          .end((err,res)=>{
            if(err){
              done()
              return
            }
            const {_id,comment}=res.body;
            assert.equal(_id,idFromPost)
            assert.equal("unique comment",comment)
          })
        })
      });
      
    });

    
    
    suite('DELETE I can delete /api/books/{_id} to delete a book from the collection. Returned will be "delete successful" if successful', function(){
      test('Test DELETE /api/books/[id] with id in db',  function(done){
        
        
        chai
        .request(server)
        .post(`/api/books`)
        .send({
          title:"test api books Delete"
        })
        .end((err,res)=>{
          if(err){
            done()
            return
          }
          
          const idFromPost=res.body._id
          
          chai
              .request(server)
              .delete(`/api/books/${idFromPost}`)
              .end((err,res)=>{
              if(err){
              done()
              return
            }
            
            assert.equal("delete successful",res.text)
              done()
            })
          
          
        })
        
        
        
      })
    })
  
  
  });

});

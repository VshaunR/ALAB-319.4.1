import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";


//create a get sinlge grade entry by is


async function getSingleGrade(req,res){

  {

    try {
      //specify collection
      let collection = await db.collection('grades');
      let query = {_id:new ObjectId(Number(req.params.id))};
      let result = await collection.findOne(query);
      res.json(result)

  
    } catch (e) {
      console.error(e);
      res.status(500).json({msg:`Server error`})
    }
  
  }

};


//get grades by student id

async function getStudentGrades(req,res){
  try {
    
    //specify collection
    let collection = await db.collection('grades');
    let query ={student_id: Number(req.params.id)}
    let results = await collection.find(query).toArray();
    console.log(results)
    res.json(results)

  } catch (e) {
    res.status(500).json({msg:'Server error'})
  }
};

async function getClassGrades(req,res){
  try {
    
    //specify collection
    let collection = await db.collection('grades');
    let query ={class_id:Number(req.params.id)}
    let results = await collection.find(query).toArray();
    res.json(results)

  } catch (e) {
    res.status(500).json({msg:'Server error'})
  }
};



async function createGrades(req,res){
try {
  
  let collection = await db.collection('grades');
  let query={
    $set:req.body
  }
  let result = await collection.insertOne(query);
  res.json(result)
} catch (e) {
  console.error(e)
  res.status(500).json({msg:`Server error`})
}

};


async function patchGrades(req,res){
  try {
    let collection = await db.collection('grades');
    let query ={
      _id: new ObjectId(req.params.id)
    };
    let update={
      $set:req.body.scores
    }
    let result = await collection.updateOne(query,update)

    res.json(result)
  } catch (e) {
    console.error(e);
    res.status(500).json({msg:'Server error'})
  }
};

async function patchClassID(req,res){

  try {
    
    let collection = await db.collection('grades');
    let query= {_id: new ObjectId(Number(req.params.id))};
    let update = {
      $set:req.body.class_id
    }
    let result = await collection.updateMany(query,update)
    res.json(result)

  } catch (e) {
    console.error(e);
    res.status(500).json({msg:'Server error'})
  }
};

//delete by id
async function deleteSingle(req,res){
  try {
    let collection = await db.collection('grades');
    let query= {_id: new ObjectId(req.params.id)};
    let result = await collection.deleteOne(query)
    res.json(result)
  } catch (e) {
    console.error(e);
    res.status(500).json({msg:'Server error'})
  }
};

async function deleteStudentById(req,res){

  try {
    let collection = await db.collection('grades');
    let query= {student_id:Number(req.params.id)}
    let result = await collection.deleteMany(query)
    res.json(result)
  } catch (e) {
    console.error(e);
    res.status(500).json({msg:'Server error'})
  }


};


async function getWeightedAvgPerStudent(req,res){

try {
  
  let collection = await db.collection('grades');

  let result = await collection.aggregate([
    
    {
      $match: { student_id: Number(req.params.id) },
    },
    {
      $unwind: { path: "$scores" },
    },
    {
      $group: {
        _id: null,
        quiz: {
          $push: {
            $cond: {
              if: { $eq: ["$scores.type", "quiz"] },
              then: "$scores.score",
              else: "$$REMOVE",
            },
          },
        },
        exam: {
          $push: {
            $cond: {
              if: { $eq: ["$scores.type", "exam"] },
              then: "$scores.score",
              else: "$$REMOVE",
            },
          },
        },
        homework: {
          $push: {
            $cond: {
              if: { $eq: ["$scores.type", "homework"] },
              then: "$scores.score",
              else: "$$REMOVE",
            },
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        class_id: "$_id",
        avg: {
          $sum: [
            { $multiply: [{ $avg: "$exam" }, 0.5] },
            { $multiply: [{ $avg: "$quiz" }, 0.3] },
            { $multiply: [{ $avg: "$homework" }, 0.2] },
          ],
        },
      },
    },

  ]).toArray();
  console.log(result)
  res.json(result)
} catch (e) {
  console.error(e);
  res.status(500).json({msg:'Server error'})
}


};





export default{getSingleGrade,getStudentGrades,getClassGrades,createGrades,patchGrades,patchClassID,deleteSingle,deleteStudentById,getWeightedAvgPerStudent}
import db from '../db/conn.mjs';
import { ObjectId } from 'mongodb';


async function getStats(req,res){

  try {
    let collection = await db.collection('grades');
    let result = await collection.aggregate(
      [
        {
          $unwind:
            /**
             * path: Path to the array field.
             * includeArrayIndex: Optional name for index.
             * preserveNullAndEmptyArrays: Optional
             *   toggle to unwind null and empty values.
             */
            {
              path: "$scores"
            }
        },
        {
          $group:
            /**
             * _id: The id of the group.
             * fieldN: The first field name.
             */
            {
              _id:"$_id",
                 
              quiz: {
                $push: {
                  $cond: {
                    if: {
                      $eq: ["$scores.type", "quiz"]
                    },
                    then: "$scores.score",
                    else: "$$REMOVE"
                  }
                }
              },
              exam: {
                $push: {
                  $cond: {
                    if: {
                      $eq: ["$scores.type", "exam"]
                    },
                    then: "$scores.score",
                    else: "$$REMOVE"
                  }
                }
              },
              homework: {
                $push: {
                  $cond: {
                    if: {
                      $eq: ["$scores.type", "homework"]
                    },
                    then: "$scores.score",
                    else: "$$REMOVE"
                  }
                }
              }
            },
          
          
        },{
          $project: {
            student_id:1,
            average:{
                $sum:[
                  {$multiply:[{$avg:"$exam"},0.5]},
                  {$multiply:[{$avg:"$quiz"},0.3]},
                  {$multiply:[{$avg:"$homework"},0.2]},
                      ]
           
            }
              
          }
        },
        {
          $group: {
            _id:"$student_id",
            myCount:{$sum:1},
            averageArr:{
              $push:"$average"
            },
           greater:{
             $push:{
               $cond:{
                 if:{$gt:["$average",70]},
                 then:"$average",
                 else:"$$REMOVE"
               }
             }
           }
          },
           
            
        
        },{
          $project: {
            student_id:1,
            averageArr:1,
            greater:1,
          }
        }

       
      ]
    ).toArray();

    res.json(result);


    
  } catch (e) {
    console.error(e);
    res.status(500).json({msg:`Server error`})
  }


};

async function getStatsWithId(req,res){
  try {
    let collection = db.collection('grades');
    let query = {class_id:Number(req.params.id)};
    let result = collection.aggregate(
      [
    
        {
          $match: { class_id: Number(req.params.id) },
        },
        {
          $unwind: { path: "$scores" },
        },
        {
          $group: {
            _id: "$class_id",
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
            class_id: "$class_id",
            avg: {
              $sum: [
                { $multiply: [{ $avg: "$exam" }, 0.5] },
                { $multiply: [{ $avg: "$quiz" }, 0.3] },
                { $multiply: [{ $avg: "$homework" }, 0.2] },
              ],
            },
          },
        },
    
      ]
    ).toArray();
    res.json(result)
  } catch (e) {
    console.error(e);
    res.status(500).json({msg:'Server Error'})
  }
}
/////////////////////////////index

async function indexes(req,res){
try {
  grades.createIndex({class_id:1},(err,result)=>{

  })
  grades.createIndex({student_id:1},(err,result)=>{
    
  });
  grades.createIndex({class_id:1,student_id:1},(err,result)=>{})
} catch (e) {
  
}
}
export default {getStats,getStatsWithId};
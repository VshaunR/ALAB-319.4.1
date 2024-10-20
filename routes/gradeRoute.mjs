import express from "express";
import dotenv from 'dotenv';
import db from "../db/conn.mjs";
import gradesCTL from '../controllers/gradesController.mjs';

dotenv.config();
const router = express.Router();
//get grades by id

router.get('/:id',gradesCTL.getSingleGrade);

//get student by id
router.get('/student/:id',gradesCTL.getStudentGrades)
//get class by id
router.get('/class/:id',gradesCTL.getClassGrades)

//get weighted avg per student across all classes
router.get('/student/:id/avg',gradesCTL.getWeightedAvgPerStudent)


//post, add new grade to database
router.post('/:id',gradesCTL.createGrades);

//update scores array
router.patch('/scores/:id',gradesCTL.patchGrades)


//update class id
router.patch('/class/:id',gradesCTL.patchClassID);

//delete doc by object id
router.delete('/:id',gradesCTL.deleteSingle);


router.delete('/student/:id',gradesCTL.deleteStudentById)
//delete student doc by student id




////////////////////////////////////////////////////////////////////////////////////////
//LAB









export default router;
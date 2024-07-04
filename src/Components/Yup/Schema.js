import * as yup from 'yup';

export const Schema = yup.object().shape({
    email:yup.string().email('Please enter a valid email address').required('Required'),
    password:yup.string().min(7).required('Required')

});

export const studentSchema = yup.object().shape({
    username: yup.string().min(3).required("Required"),
    regNO: yup.string().min(10).required('Required'),
    email:yup.string().email('Please enter a valid email address').required('Required'),
    password:yup.string().min(7).required('Required'),
    program:yup.string().min(7).required('Required'),
    isClassRep:yup.boolean()

});

export const moduleSchema = yup.object().shape({
    programsId:yup.array().max(5).required('Required'),
    name:yup.string().min(5).required('Required'),
    code:yup.string().min(3).required('Required'),
    lecturer:yup.string().min(4).required('Required'),

   
});
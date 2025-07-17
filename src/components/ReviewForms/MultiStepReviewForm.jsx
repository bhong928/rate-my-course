import { useState } from "react";
import StepRating from "./StepRating";
import StepComment from "./StepComment";
import StepDetails from "./StepDetails";
import StepReviewSummary from "./StepReviewSummary";

export default function MultiStepReviewForm (props) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        greenRating: 0,
        fairwayRating: 0,
        roughRating: 0,
        staffRating: 0,
        comments: "",
        photos: [], // if you're not uploading yet, this can stay
        handicap: "",
        numPlayer: "",
    });

    const next = () => setStep((prev) => prev + 1);
    const back = () => setStep((prev) => prev - 1);

    return (
        <>
            {step === 1 && <StepRating data={formData} setData={setFormData} next={next} />}
            {step === 2 && <StepComment data={formData} setData={setFormData} next={next} back={back} />}
            {step === 3 && <StepDetails data={formData} setData={setFormData} next={next} back={back} />}
            {step === 4 && <StepReviewSummary data={formData} setData={setFormData} next={next} back={back}/>}
        </>
    )
}
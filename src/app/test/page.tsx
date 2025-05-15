"use client"

import { useEffect, useState } from "react"


export default function Screen() {
    const [ symptoms, setSymptom ] = useState("")
    const [ sickness, setSickness ] = useState("")
    const [ treatment, setTreatment ] = useState("")
    const [ id, setID ] = useState("")
    const [ recordID, setRecordID ] = useState("")

    useEffect(() => {
        fetch("/api/session").then((e) => e.json()).then(v => setID(v.id))
    }, [])

    return (
        <div>
            Test
            <br></br>
            <input className="bg-white text-black" onChange={(e) => setSymptom(e.target.value)}></input>
            <br></br>
            <input className="bg-white text-black" onChange={(e) => setSickness(e.target.value)}></input>
            <br></br>
            <input className="bg-white text-black" onChange={(e) => setTreatment(e.target.value)}></input>
            <br></br>
            <button onClick={() => {
                fetch("/api/record", {
                    method: 'POST',
                    body: JSON.stringify({
                        symptoms: symptoms,
                        sickness: sickness,
                        treatment: treatment
                    })
                })
            }}> Submitting | Symptom: {symptoms} | Sickness: {sickness} | Treatment: {treatment} </button>
            <br>
            </br>
            <div>
                Your ID: { id }
            </div>

            <br></br>
            <div>
                <input className="bg-white text-black" onChange={(e) => setRecordID(e.target.value)}></input>
            </div>
            <button onClick={() => {
                fetch(`/api/verify/${recordID}`, {
                    method: 'POST'
                })
            }}>
                Verify Record #{recordID}
            </button>
        </div>
    )
}
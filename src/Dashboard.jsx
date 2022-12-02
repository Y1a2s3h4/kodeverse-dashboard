import React, { useState, useEffect, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import axios from "axios"
import { ProSidebar, Menu, MenuItem, SidebarHeader } from 'react-pro-sidebar';
import AddForm from './components/addForm.component'
import UploadForm from './components/upload.component';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import KodeGrayLogo from "./kode-gray-logo.svg"
import NetworkGrayLogo from "./network-gray.png"
import 'react-pro-sidebar/dist/css/styles.css';
import Spinner from './components/Spinner';

export default function Dashboard() {
    const updateModalRef = useRef()
    const initialState = {
        company_logo: "",
        company_name: "",
        type: "",
        email: "",
        tags: "",
    }
    const [component, setComponent] = useState({ addJob: false, viewJob: true })
    const [job, setJob] = useState(initialState)
    const [toggleForm, setToggleForm] = useState({ form: true, upload: false })
    const [collapsed, setCollapsed] = useState(true)
    const [newJob, setNewJob] = useState({
        _id: "",
        company_logo: "",
        company_name: "",
        type: "",
        email: "",
        tags: "",
    })
    const [allJobs, setAllJobs] = useState([])
    const [fileData, setFileData] = useState(null)
    const [toggleData, setToggleData] = useState(false)
    const getJobs = async (e) => {
        try {
            const { data } = await axios.get("/.netlify/functions/view")
            console.log(data)
            setAllJobs(data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getJobs()
    }, [])
    const addJob = async (e) => {
        try {
            e.preventDefault()
            console.log(job.type, job.type.toLowerCase())
            const data = await axios.post("/.netlify/functions/create", {
                ...job,
                job: "Check Linkedin Page Job Posts | Thier Career Site",
                domain: job.type.toLowerCase() === "tech" ? "IT, Software, Product, Engineering, Management" : "HR, Marketing, Operations, Finance, Sales",
                opening_site: job?.type?.toLowerCase() === "tech" ? "https://t.me/kodeverse" : "https://t.me/kodeverseNT"
            })
            setJob({ ...initialState })
            e.target.reset()
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }
    const modalHandleChange = (e) => {
        if (e.target.name === "company_logo") {
            let reader = new FileReader()
            reader.readAsDataURL(e.target.files[0])
            reader.addEventListener("load", () => {
                setNewJob({ ...job, [e.target.name]: reader.result })
            })
        } else {
            if (e.target.name === "tags") {
                let tags = e.target.value.split(",")
                tags = tags.map(tag => {
                    let a = tag.trim()
                    return a.toLowerCase()
                })
                setNewJob({ ...newJob, [e.target.name]: tags })
            }
            else {
                setNewJob({ ...newJob, [e.target.name]: e.target.value })
            }
        }

    }
    const updateJob = async (e) => {
        try {
            e.preventDefault()
            const data = await axios.patch("/.netlify/functions/update", newJob)
            setAllJobs(data.data)
            updateModalRef.current.click()
            toast("Updated Successfully!!!");
        } catch (error) {
            console.log(error)
        }
    }
    const handleDeleteJob = async (job) => {
        try {
            if (window.confirm("Are you sure you want to delete this job?")) {
                const data = await axios.delete("/.netlify/functions/delete?jobId=" + job._id)
                setAllJobs(data.data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleChange = (e) => {
        if (e.target.name === "company_logo") {
            let reader = new FileReader()
            reader.readAsDataURL(e.target.files[0])
            reader.addEventListener("load", () => {
                setJob({ ...job, [e.target.name]: reader.result })
            })
        } else {
            if (e.target.name === "tags") {
                let tags = e.target.value.split(",")
                tags = tags.map(tag => {
                    let a = tag.trim()
                    return a.toLowerCase()
                })
                setJob({ ...job, [e.target.name]: tags })
            }
            else {
                setJob({ ...job, [e.target.name]: e.target.value })
            }
        }
    }
    const handleFileUpload = async (e) => {
        try {
            const file = e.target.files[0]
            const formData = new FormData()
            formData.append('file', file)
            console.log(formData.get("file"))
            setFileData(formData)
        } catch (error) {
            console.log(error)
        }
    }
    const handleSubmitFileUpload = async (e) => {
        try {
            e.preventDefault()
            setToggleData(true)
            const data = await axios.post('/.netlify/functions/upload_file', fileData)
            console.log(data)
            if (data.data.length > 0) {
                setFileData(null)
                setToggleData(false)
                toast("JSON File Uploaded Succesfully!!!", { type: "success" });
            }
            console.log(data)
        } catch (error) {
            toast("JSON File Upload Failed. Please Try Again !!!", { type: "error" });
            console.log(error)
        }
    }
    const addJobsComponent = () => (
        <div className="my-5">
            <div className="d-flex justify-content-between flex-wrap">
                <h1><b>Add new job post</b></h1>
                <div className="btn-group" role="group" aria-label="Basic outlined example">
                    <button type="button" onClick={() => setToggleForm({ form: true, upload: false })} className={`btn btn-${toggleForm.form ? 'secondary' : 'outline-secondary'}`}>Form</button>
                    <button type="button" onClick={() => setToggleForm({ upload: true, form: false })} className={`btn btn-${toggleForm.upload ? 'secondary' : 'outline-secondary'}`}>Upload JSON File</button>
                </div>
            </div>
            {toggleForm.form && <AddForm handleFormChange={handleChange} addFormJob={addJob} jobForm={job} />}
            {toggleForm.upload && <UploadForm handleFileUpload={handleFileUpload} fileData={fileData} handleSubmitFileUpload={handleSubmitFileUpload} toggle={{
                toggleData, setToggleData
            }} />}
        </div>)
    const viewJobsComponent = () => (<div className="my-5">
        <h1><b>View all job posts</b></h1>
        <div className="row flex-wrap justify-content-between">
            {
                // <Spinner />
                allJobs.length === 0 ? <div className="col-md-3 flex-wrap"><Spinner /></div> : allJobs.map((e) => (
                    <div className="col-md-3 flex-wrap" key={uuidv4()}>
                        <div className="card cursor-pointer m-3" style={{ minWidth: "15rem", maxWidth: "20rem" }}>
                            <div className="p-5">
                                <center>
                                    <img src={e.company_logo} className="card-img-top" alt="company_logo" />
                                </center>
                            </div>
                            <div className="card-body">
                                <h5 className="card-title"><b>{e.company_name}</b></h5>
                                <p className="card-text">Type: {e.type}</p>
                            </div>
                            <div className="card-overlay position-absolute">
                            </div>
                            <button onClick={() => { setNewJob(e) }} data-bs-toggle="modal" data-bs-target="#exampleModal" className="btn btn-primary edit-btn position-absolute"><i className="bi bi-pencil-square"></i></button>
                            <button onClick={() => { handleDeleteJob(e) }} className="btn btn-danger delete-btn position-absolute"><i className="bi bi-trash3-fill"></i></button>
                        </div>
                    </div>
                ))
            }
        </div>
        <div className="modal" tabIndex="-1" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Modal title</h5>
                        <button type="button" ref={updateModalRef} className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form className="" onSubmit={updateJob} onChange={modalHandleChange}>
                            <div className="company_logo">
                                <div>
                                    <label htmlFor="company_logo">
                                        <h4>Company Logo</h4>
                                        <label htmlFor="new_company_logo" id="company-logo">
                                            <input type="file" required className="form-control company_logo d-none" name="company_logo" id="new_company_logo" />
                                            <center><img src={newJob.company_logo} className="company_logo" alt="company_logo" /></center>
                                        </label>
                                    </label>
                                </div>
                            </div>
                            <div className="company_name">
                                <label htmlFor="company_name" className="form-label"><h4>Name of the company</h4></label>
                                <input autoComplete='off' type="text" value={newJob.company_name} required className="form-control company_name" name="company_name" id="company_name" placeholder="Eg: Google, Microsoft, etc" />
                            </div>
                            <div className="type">
                                <label htmlFor="type" className="form-label"><h4>Type</h4></label>
                                <input autoComplete='off' type="text" value={newJob.type} required className="form-control type" name="type" id="type" placeholder="Eg: Tech or Non-Tech" />
                            </div>
                            <div className="email_id">
                                <label htmlFor="company_name" className="form-label"><h4>Email</h4></label>
                                <input autoComplete='off' type="email" value={newJob.email} required className="form-control email_id" name="email" id="email_id" placeholder="Eg: jhon@microsoft.com" />
                            </div>
                            <div className="tags">
                                <label htmlFor="tags" className="form-label"><h4>Tags</h4></label>
                                <input autoComplete='off' type="text" value={newJob.tags} className="form-control tags" name="tags" id="tags" placeholder="Eg: sde, google, tech job" />
                            </div>
                            <div className="submit-btn">
                                <button type="submit" className='btn btn-primary'>Update &nbsp;<i className="bi bi-check-lg"></i></button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div >)
    return (
        <>
            <div className="d-flex">
                <ProSidebar collapsed={collapsed}>
                    <SidebarHeader className="position-relative">
                        <div>
                            <p style={{
                                alignSelf: "center", margin: 0, padding: '24px',
                                textTransform: 'uppercase',
                                fontWeight: 'bold',
                                letterSpacing: '1px',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                display: "flex",
                                cursor: "pointer",
                                justifyContent: "center"
                            }}>{collapsed ?
                                <img style={{ width: "3rem" }} src={NetworkGrayLogo} alt="" />
                                : <img style={{
                                    width: "11rem"
                                }} src={KodeGrayLogo} alt="" />}</p>
                            {
                                !collapsed && (<p onClick={() => setCollapsed(!collapsed)} style={{ cursor: "pointer", fontSize: 15, width: "30px", backgroundColor: "white", padding: "14px" }} className="top-100 start-100 translate-middle shadow-lg position-absolute rounded-circle"><i style={{ fontWeight: "bold" }} className="bi bi-chevron-left top-50 start-50 translate-middle p-0 m-0 position-absolute text-black "></i></p>)
                            }
                            {
                                collapsed && (<p onClick={() => setCollapsed(!collapsed)} style={{ cursor: "pointer", fontSize: 15, width: "30px", backgroundColor: "white", padding: "14px" }} className="top-100 start-100 translate-middle shadow-lg position-absolute rounded-circle"><i style={{ fontWeight: "bold" }} className="bi bi-chevron-right top-50 start-50 translate-middle p-0 m-0 position-absolute text-black "></i></p>)
                            }
                        </div>
                    </SidebarHeader >
                    <Menu iconShape="square" className="mt-4">
                        <MenuItem icon={<i className="bi bi-view-list"></i>} onClick={() => {
                            setComponent({ addJob: false, viewJob: true })
                            getJobs()
                        }}>View Jobs</MenuItem>
                        <MenuItem icon={<i className="bi bi-file-plus"></i>} onClick={() => {
                            setComponent({ viewJob: false, addJob: true })
                        }}>Add Jobs</MenuItem>
                    </Menu>
                </ProSidebar>
                <div className="container mx-auto">
                    {component.addJob && addJobsComponent()}
                    {component.viewJob && viewJobsComponent()}
                    <ToastContainer
                        position="bottom-center"
                        autoClose={2000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        type
                    />
                </div>
            </div>
        </>
    )
}
import {useEffect, useState} from 'react';
import {useAuth0} from "@auth0/auth0-react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

export default function Example() {
    const [file, setFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState('');
    const { user, isAuthenticated } = useAuth0();
    const [message, setMessage] = useState('');
    const [userDetailsSent, setUserDetailsSent] = useState(false);
    const navigate = useNavigate();

    
      useEffect(() => {
        const sendUserDetails = async () => {
          if (isAuthenticated && user && !userDetailsSent) {
            try {
              const config = {
                method: 'get',
                url: `https://dev-0jzyevoto3y0pe6j.us.auth0.com/api/v2/users/${user.sub}`,
                headers: {
                  'Accept': 'application/json',
                  'Authorization': 'Bearer '
                }
              };
      
              const response = await axios.request(config);
              await fetch('https://freematchpoint.com/api/user-details', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(response.data),
              });
      
              setUserDetailsSent(true);
            } catch (error) {
              console.error('Error sending user details:', error);
            }
          }
        };
      
        sendUserDetails();
      }, [isAuthenticated, user, userDetailsSent]);
      
      

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile && isValidFileType(selectedFile)) {
            setFile(selectedFile);
        } else {
            alert('Please select a valid file format (PDF, DOCX, or DOC)');
        }
    };

    const isValidFileType = (file: File): boolean => {
        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword'
        ];
        return allowedTypes.includes(file.type);
    };

    const handleUpload = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        if (!file || !jobDescription) {
            setMessage('Please select both resume and job description files.');
            return;
        }

        const formData = new FormData();
        formData.append('user_id', user?.sub || '');
        formData.append('resume', file);
        formData.append('job_description', jobDescription);

        try {
            // First, upload the files
            const uploadResponse = await axios.post('https://freematchpoint.com/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (uploadResponse.status === 200) {
                // If upload is successful, call generate_feedback API
                // console.log(uploadResponse.data);
                const { resume_path, job_description_path } = uploadResponse.data;

                const generateResponse = await axios.post('https://freematchpoint.com/api/generate_feedback', {
                    user_id: user?.sub,
                    resume_path: resume_path,
                    job_description_path: job_description_path
                });

                if (generateResponse.status === 200) {
                    setMessage('Feedback generated successfully');
                    navigate('/feedback');
                } else {
                    setMessage('Error generating feedback');
                }
            } else {
                setMessage('Error uploading files');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setMessage(`${error.response?.data?.detail || error.message}`);
            } else if (error instanceof Error) {
                setMessage(`${error.message}`);
            } else {
                setMessage('An unknown error occurred');
            }
        }
    };

    return (
        <>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <div className="text-center">
                <svg className="mx-auto size-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                </svg>
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No Resume</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by uploading a new resume.</p>
                <div className="mt-6">
                    <label htmlFor="file-upload" className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer">
                        <svg className="-ml-0.5 mr-1.5 size-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"/>
                        </svg>
                        New Resume
                    </label>
                    <input id="file-upload" type="file" className="hidden" accept=".pdf,.docx,.doc" onChange={handleFileChange} />
                </div>
            </div>

            <div className="mt-8 max-w-xl mx-auto">
                <label htmlFor="job-description" className="block text-sm font-medium text-gray-700">
                    Job Description
                </label>
                <textarea
                    id="job-description"
                    name="job-description"
                    rows={4}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    placeholder="Enter the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                ></textarea>
            </div>

            {file && (
                <div className="mt-4">
                    <p className="text-sm text-gray-600">Selected file: {file.name}</p>
                    <button
                        onClick={handleUpload}
                        className="mt-2 inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                    >
                        Upload Resume and Job Description
                    </button>
                </div>
            )}
            {message && <p>{message}</p>}

            <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 className="text-pretty text-4xl font-semibold tracking-tight text-black sm:text-5xl">Why Upload Your Resume with Us?</h2>
                    <p className="mt-6 text-lg/8 text-gray-900">We are committed to helping you unlock your career potential by providing actionable, data-driven insights that make your resume shine. Your success is our mission.</p>
                </div>
                <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-base/7 text-gray-900 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-16">
                    <div className="relative pl-9">
                        <dt className="inline font-semibold text-black">
                            <svg className="absolute left-1 top-1 size-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                <path fill-rule="evenodd" d="M4.606 12.97a.75.75 0 0 1-.134 1.051 2.494 2.494 0 0 0-.93 2.437 2.494 2.494 0 0 0 2.437-.93.75.75 0 1 1 1.186.918 3.995 3.995 0 0 1-4.482 1.332.75.75 0 0 1-.461-.461 3.994 3.994 0 0 1 1.332-4.482.75.75 0 0 1 1.052.134Z" clip-rule="evenodd"/>
                                <path fill-rule="evenodd" d="M5.752 12A13.07 13.07 0 0 0 8 14.248v4.002c0 .414.336.75.75.75a5 5 0 0 0 4.797-6.414 12.984 12.984 0 0 0 5.45-10.848.75.75 0 0 0-.735-.735 12.984 12.984 0 0 0-10.849 5.45A5 5 0 0 0 1 11.25c.001.414.337.75.751.75h4.002ZM13 9a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" clip-rule="evenodd"/>
                            </svg>
                            AI Precision Analysis.
                        </dt>
                        <dd className="inline"> Our platform leverages cutting-edge AI to analyze your resume against industry-specific benchmarks. Receive tailored recommendations to optimize content, structure, and keywords for maximum impact.</dd>
                    </div>
                    <div className="relative pl-9">
                        <dt className="inline font-semibold text-black">
                            <svg className="absolute left-1 top-1 size-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                <path d="M15.98 1.804a1 1 0 0 0-1.96 0l-.24 1.192a1 1 0 0 1-.784.785l-1.192.238a1 1 0 0 0 0 1.962l1.192.238a1 1 0 0 1 .785.785l.238 1.192a1 1 0 0 0 1.962 0l.238-1.192a1 1 0 0 1 .785-.785l1.192-.238a1 1 0 0 0 0-1.962l-1.192-.238a1 1 0 0 1-.785-.785l-.238-1.192ZM6.949 5.684a1 1 0 0 0-1.898 0l-.683 2.051a1 1 0 0 1-.633.633l-2.051.683a1 1 0 0 0 0 1.898l2.051.684a1 1 0 0 1 .633.632l.683 2.051a1 1 0 0 0 1.898 0l.683-2.051a1 1 0 0 1 .633-.633l2.051-.683a1 1 0 0 0 0-1.898l-2.051-.683a1 1 0 0 1-.633-.633L6.95 5.684ZM13.949 13.684a1 1 0 0 0-1.898 0l-.184.551a1 1 0 0 1-.632.633l-.551.183a1 1 0 0 0 0 1.898l.551.183a1 1 0 0 1 .633.633l.183.551a1 1 0 0 0 1.898 0l.184-.551a1 1 0 0 1 .632-.633l.551-.183a1 1 0 0 0 0-1.898l-.551-.184a1 1 0 0 1-.633-.632l-.183-.551Z"/>
                            </svg>
                            Custom Tailored Feedback.
                        </dt>
                        <dd className="inline"> No cookie-cutter solutions here. We provide personalized feedback that focuses on your unique skills, career goals, and target industry, ensuring your resume stands out in the crowd.</dd>
                    </div>
                    <div className="relative pl-9">
                        <dt className="inline font-semibold text-black">
                            <svg className="absolute left-1 top-1 size-5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                <path d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2ZM10 15a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 15ZM10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM15.657 5.404a.75.75 0 1 0-1.06-1.06l-1.061 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM6.464 14.596a.75.75 0 1 0-1.06-1.06l-1.06 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM18 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 18 10ZM5 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 5 10ZM14.596 15.657a.75.75 0 0 0 1.06-1.06l-1.06-1.061a.75.75 0 1 0-1.06 1.06l1.06 1.06ZM5.404 6.464a.75.75 0 0 0 1.06-1.06l-1.06-1.06a.75.75 0 1 0-1.061 1.06l1.06 1.06Z"/>
                            </svg>
                            Data-Driven Insights.
                        </dt>
                        <dd className="inline"> Track your resume's performance with key metrics, learn about recruiter preferences, and receive actionable insights that enhance your chances of landing the perfect job.</dd>
                    </div>
                </dl>
            </div>

            <br></br>
            <br></br>
            <br></br>

        </>
    )
}
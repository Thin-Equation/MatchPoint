import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

export default function FeedbackPage() {
    const [compatibilityScore, setCompatibilityScore] = useState(0);
    const {user} = useAuth0();
    const [textFeedback, setTextFeedback] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    
    const fetchFeedbackData = async () => {
        try {
            setIsLoading(true);
            const user_id = user?.sub; // Replace with the user ID of the logged-in user
            const response = await axios.get(`http://localhost:8000/api/get_feedback_details/${user_id}`);
            const data = response.data;

            setCompatibilityScore(data.score);
            setTextFeedback(data.feedback);
        } catch (error) {
            console.error('Error fetching feedback data:', error);
            setTextFeedback('An error occurred while fetching feedback. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { 
        fetchFeedbackData();
    });
    

    
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                            Resume Feedback
                        </h2>
                    </div>
                    <div className="border-t border-gray-200">
                        {isLoading ? (
                            <div className="p-4 text-center">
                                <p>Loading feedback...</p>
                            </div>
                        ) : (
                            <div className="p-4">
                                <div className="mb-8 flex justify-center">
                                    <div style={{ width: 200, height: 200 }}>
                                        <CircularProgressbar
                                            value={compatibilityScore}
                                            text={`${compatibilityScore}%`}
                                            styles={buildStyles({
                                                textSize: '16px',
                                                pathColor: `rgba(62, 152, 199, ${compatibilityScore / 100})`,
                                                textColor: '#3e98c7',
                                                trailColor: '#d6d6d6',
                                            })}
                                        />
                                    </div>
                                </div>
                                <div className="text-center mb-8">
                                    <h3 className="text-xl font-semibold text-gray-900">Compatibility Score</h3>
                                </div>
                                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                                    <div className="px-4 py-5 sm:p-6">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            Feedback
                                        </h3>
                                        <div className="mt-2 max-w-xl text-sm text-gray-500">
                                            <p>{textFeedback}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
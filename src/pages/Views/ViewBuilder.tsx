import React from 'react'
import "../../css/pages/Views/ViewBuilder.css"

const ViewBuilder = () => {
    return (
        <div className='box'>
            <div className="">
                <h1 className='heading'>Create View</h1>
            </div>

            <div className="view-details">
                <div className="leftSection">
                    <div className="box-heading">
                        <h1 className='text-xl font-semibold'>Projects</h1>
                    </div>

                    <div className="box-projects-parent">
                        <div className="box-projects">
                            JobStatus Views
                        </div>
                        <div className="box-projects">
                            Vendor Views
                        </div>
                        <div className="box-projects">
                            TeamMember Views
                        </div>
                    </div>

                </div>

                <div className="rightSection">
                    <div className="box-heading">
                        <h1 className='text-xl font-semibold'>JobStatus Views</h1>
                    </div>

                    <div className="box-views-parent">
                     
                    <div className="box-view">
                        JobStatus-View-1
                    </div>

                    <div className="box-view">
                        JobStatus-View-2
                    </div>

                    <div className="box-view">
                        JobStatus-View-3
                    </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default ViewBuilder
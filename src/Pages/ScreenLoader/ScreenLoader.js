import React from 'react'

const ScreenLoader = () => {
    return (
        <>
            <main className='d-flex justify-content-center align-items-center' style={{ height: '100vh', backgroundColor: "black" }} >
                {/* <span className="loader"></span> */}
                {/* <!-- From Uiverse.io by mobinkakei --> */}
                {/* <div id="wifi-loader">
                    <svg className="circle-outer" viewBox="0 0 86 86">
                        <circle className="back" cx="43" cy="43" r="40"></circle>
                        <circle className="front" cx="43" cy="43" r="40"></circle>
                        <circle className="new" cx="43" cy="43" r="40"></circle>
                    </svg>
                    <svg className="circle-middle" viewBox="0 0 60 60">
                        <circle className="back" cx="30" cy="30" r="27"></circle>
                        <circle className="front" cx="30" cy="30" r="27"></circle>
                    </svg>
                    <svg className="circle-inner" viewBox="0 0 34 34">
                        <circle className="back" cx="17" cy="17" r="14"></circle>
                        <circle className="front" cx="17" cy="17" r="14"></circle>
                    </svg>
                    <div className="text" data-text="Loading"></div>
                </div> */}
                {/* <div id="timer">
                    <div id="div1"></div>
                    <div id="div2"></div>
                    <div id="div3"></div>
                    <div id="div4"></div>
                    <div id="div5"></div>
                    <div id="div6"></div>
                    <div id="div7"></div>
                    <div id="div8"></div>
                    <div id="div9"></div>
                    <div id="div10"></div>
                    <div id="div11"></div>
                    <div id="div12"></div>
                    <div id="div13"></div>
                    <div id="div14"></div>
                    <div id="div15"></div>
                </div> */}
<div class="banter-loader">
  <div class="banter-loader__box"></div>
  <div class="banter-loader__box"></div>
  <div class="banter-loader__box"></div>
  <div class="banter-loader__box"></div>
  <div class="banter-loader__box"></div>
  <div class="banter-loader__box"></div>
  <div class="banter-loader__box"></div>
  <div class="banter-loader__box"></div>
  <div class="banter-loader__box"></div>
</div>


            </main>
        </>
    )
}

export default ScreenLoader
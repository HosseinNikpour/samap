/* eslint-disable eqeqeq */
import * as React from 'react';
//import Viewer from 'react-viewer';
import img1 from '../assets/img/mainpage/1.jpg';
import img2 from '../assets/img/mainpage/2.jpg';

const ImageViewer = (props) => {
 
 const urlSearchParams = new URLSearchParams(window.location.search);
 const params = Object.fromEntries(urlSearchParams.entries());
 //console.log(params.id)

  return (
    <div>
     <img src={params.id==1?img1:img2} alt='' style={{width:'100%'}}></img>
      {/* <Viewer
      visible={true}
     
      images={[{src: params.id==1?img1:img2, alt: ''}]}
      /> */}
    </div>
  );
}
export default ImageViewer;
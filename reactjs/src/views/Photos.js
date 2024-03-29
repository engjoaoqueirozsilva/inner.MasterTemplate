/*!

=========================================================
* Paper Dashboard React - v1.3.1
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import Photos from "components/Photo/Photo";
// reactstrap components
import {
    Row,
    Col
} from "reactstrap";

function Photo() {
  return (
        <>
            <div className="content">
                <Row>
                    <Col md="12">
                        <Photos/>                
                    </Col>
                </Row>
            </div>
        </>
    );
}
          export default Photo;
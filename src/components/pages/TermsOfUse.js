import React from "react";
import { withRouter, Link } from "react-router-dom";

const TermsOfUse = ({ styles, history }) => {
  const sectionHeaderStyle = { fontWeight: "bold", margin: "10px 0px" };
  const textStyle = {
    lineHeight: 1.4,
    color: styles.black(0.7),
    margin: "10px 0px"
  };

  const renderHeader = () => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          height: styles.appHeaderHeight,
          position: "fixed",
          backgroundColor: styles.secondary(1)
        }}
      >
        <div style={{ flex: 1, color: "transparent" }}>h</div>
        <Link
          to={"/"}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: styles.white(0.9),
            fontSize: 16,
            fontWeight: "bold",
            flex: 3
          }}
        >
          Movie Medium
        </Link>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "center"
          }}
        >
          <div
            onClick={() => history.goBack()}
            style={{
              marginRight: 15,
              color: styles.white(0.8),
              transform: "rotate(45deg)",
              fontSize: 36,
              cursor: "pointer"
            }}
          >
            +
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {renderHeader()}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: 500,
          padding: "100px 0px",
          margin: "auto"
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontWeight: "bold",
            color: styles.primary(1),
            marginBottom: 0
          }}
        >
          Terms of Use
        </h2>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <div
            className={"plainText"}
            style={{ padding: "20px 20px", maxWidth: 600 }}
          >
            <h3>1. Terms</h3>
            <p>
              By accessing the website at{" "}
              <a href="https://moviemedium.io">https://moviemedium.io</a>, you
              are agreeing to be bound by these terms of service, all applicable
              laws and regulations, and agree that you are responsible for
              compliance with any applicable local laws. If you do not agree
              with any of these terms, you are prohibited from using or
              accessing this site. The materials contained in this website are
              protected by applicable copyright and trademark law.
            </p>
            <h3>2. Use License</h3>
            <ol type="a">
              <li>
                Permission is granted to temporarily download one copy of the
                materials (information or software) on Movie Medium's website
                for personal, non-commercial transitory viewing only. This is
                the grant of a license, not a transfer of title, and under this
                license you may not:
                <ol type="i">
                  <li>modify or copy the materials;</li>
                  <li>
                    use the materials for any commercial purpose, or for any
                    public display (commercial or non-commercial);
                  </li>
                  <li>
                    attempt to decompile or reverse engineer any software
                    contained on Movie Medium's website;
                  </li>
                  <li>
                    remove any copyright or other proprietary notations from the
                    materials; or
                  </li>
                  <li>
                    transfer the materials to another person or "mirror" the
                    materials on any other server.
                  </li>
                </ol>
              </li>
              <li>
                This license shall automatically terminate if you violate any of
                these restrictions and may be terminated by Movie Medium at any
                time. Upon terminating your viewing of these materials or upon
                the termination of this license, you must destroy any downloaded
                materials in your possession whether in electronic or printed
                format.
              </li>
            </ol>
            <h3>3. Disclaimer</h3>
            <ol type="a">
              <li>
                The materials on Movie Medium's website are provided on an 'as
                is' basis. Movie Medium makes no warranties, expressed or
                implied, and hereby disclaims and negates all other warranties
                including, without limitation, implied warranties or conditions
                of merchantability, fitness for a particular purpose, or
                non-infringement of intellectual property or other violation of
                rights.
              </li>
              <li>
                Further, Movie Medium does not warrant or make any
                representations concerning the accuracy, likely results, or
                reliability of the use of the materials on its website or
                otherwise relating to such materials or on any sites linked to
                this site.
              </li>
            </ol>
            <h3>4. Limitations</h3>
            <p>
              In no event shall Movie Medium or its suppliers be liable for any
              damages (including, without limitation, damages for loss of data
              or profit, or due to business interruption) arising out of the use
              or inability to use the materials on Movie Medium's website, even
              if Movie Medium or a Movie Medium authorized representative has
              been notified orally or in writing of the possibility of such
              damage. Because some jurisdictions do not allow limitations on
              implied warranties, or limitations of liability for consequential
              or incidental damages, these limitations may not apply to you.
            </p>
            <h3>5. Accuracy of materials</h3>
            <p>
              The materials appearing on Movie Medium's website could include
              technical, typographical, or photographic errors. Movie Medium
              does not warrant that any of the materials on its website are
              accurate, complete or current. Movie Medium may make changes to
              the materials contained on its website at any time without notice.
              However Movie Medium does not make any commitment to update the
              materials.
            </p>
            <h3>6. Links</h3>
            <p>
              Movie Medium has not reviewed all of the sites linked to its
              website and is not responsible for the contents of any such linked
              site. The inclusion of any link does not imply endorsement by
              Movie Medium of the site. Use of any such linked website is at the
              user's own risk.
            </p>
            <h3>7. Modifications</h3>
            <p>
              Movie Medium may revise these terms of service for its website at
              any time without notice. By using this website you are agreeing to
              be bound by the then current version of these terms of service.
            </p>
            <h3>8. Governing Law</h3>
            <p>
              These terms and conditions are governed by and construed in
              accordance with the laws of IL and you irrevocably submit to the
              exclusive jurisdiction of the courts in that State or location.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(TermsOfUse);
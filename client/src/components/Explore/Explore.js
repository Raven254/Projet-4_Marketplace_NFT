import React from "react";
import getAllCollections from "../../fake_data/Collections.js";
import Catalog from "./Catog.js";

export class Explore extends React.Component {
    render() {
        return (
          <div style={{
            paddingRight:200,
            paddingLeft:200,

          }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                paddingTop: 15,
                height: 150
              }}
            >
              <h2 style={{fontSize:'2em',textAlign:'center'}}>Explore the collections</h2>
            </div>
              <div className="explore__content">
                {
                  getAllCollections().map((item, index) => (
                    <Catalog
                    key={index}
                    img={item.image}
                    name={item.title}
                    id={item.id}
                   />
                   ))
                }
              </div>
            </div>
          );
    }
}
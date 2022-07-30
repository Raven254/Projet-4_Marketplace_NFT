import React from "react";
import { useParams } from "react-router-dom";

const Collection = () => {
    const params = useParams();
        return (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '90vh'
              }}
            >
              <h1>Collection {params.id}</h1>
            </div>
          );
    }

export default Collection
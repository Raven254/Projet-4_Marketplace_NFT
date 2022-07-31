import React, {useState} from 'react'
import PropTypes from 'prop-types'

import { Link } from 'react-router-dom'
import {Button} from '../Button/ButtonElements'

const Catalog = props => {
    const [hover, setHover] = useState(false)
    const onHover = () => {
    setHover(!hover)
    }

    return (
        <div className="catalog">
            <Link to={`/Collection/${props.id}`}>
                    <img src={props.img}  className='img' alt="" />
            </Link>
            <div className="catalog__btn">
                <Button to={`/Collection/${props.id}`}
                    onMouseEnter={onHover} onMouseLeave={onHover} primary='true' dark='true'
                >
                    {props.name}
                </Button>
            </div>
        </div>
    )
}

Catalog.propTypes = {
    id:PropTypes.number.isRequired,
    img: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
}

export default Catalog
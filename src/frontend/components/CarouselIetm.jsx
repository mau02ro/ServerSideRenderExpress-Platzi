import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
/*____ Igm ____*/
import IconPlay from "../assets/static/play-icon.png";
import IconPlus from "../assets/static/plus-icon.png";
import IconRemove from "../assets/static/remove-icon_a56b8107-2c02-49ed-bead-308031b0dd76.png";
/*____ styles ____*/
import "../assets/components/CarouselItem.scss";
/*____ actions ____*/
import { setFavorite, deleteFavorite } from "../actions/index";
import { Link } from "react-router-dom";

const CarouselIetm = (props) => {
  const { id, cover, title, year, contentRaiteng, duration } = props;

  const handleSetFavorite = () => {
    props.setFavorite({
      id,
      cover,
      title,
      year,
      contentRaiteng,
      duration,
    });
  };

  const handleDeleteFavorite = (itemId) => {
    props.deleteFavorite(itemId);
  };

  return (
    <div className="carousel-item">
      <img className="carousel-item__img" src={cover} alt={title} />
      <div className="carousel-item__details">
        <div>
          {!props.isList && (
            <img
              className="carousel-item__details--img"
              src={IconPlus}
              alt="Plus Icon"
              onClick={handleSetFavorite}
            />
          )}
          <Link to={`/player/${id}`}>
            <img
              className="carousel-item__details--img"
              src={IconPlay}
              alt="Play Icon"
            />
          </Link>

          {props.isList && (
            <img
              src={IconRemove}
              className="carousel-item__details--img"
              alt="Play Icon"
              onClick={() => {
                handleDeleteFavorite(id);
              }}
            />
          )}
        </div>
        <p className="carousel-item__details--title">{title}</p>
        <p className="carousel-item__details--subtitle">
          {`${year} ${contentRaiteng} ${duration}`}
        </p>
      </div>
    </div>
  );
};

CarouselIetm.propTypes = {
  cover: PropTypes.string,
  title: PropTypes.string,
  number: PropTypes.number,
  contentRaiteng: PropTypes.string,
  duration: PropTypes.number,
};

const mapDispatchToProps = {
  setFavorite,
  deleteFavorite,
};

export default connect(null, mapDispatchToProps)(CarouselIetm);

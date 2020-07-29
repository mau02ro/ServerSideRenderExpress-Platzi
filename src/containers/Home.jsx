import React from "react";
import { connect } from "react-redux";
/*____ Components ____*/
import Search from "../components/Search";
import Categories from "../components/Categories";
import Caroursel from "../components/Carousel";
import CarouselItem from "../components/CarouselIetm";
import Header from "../components/Header";

/*____ Styles ____*/
import "../assets/styles/App.scss";

const Home = ({ mylist, originals, trends }) => {
  return (
    <div>
      <Header />
      <Search />
      {mylist.length != 0 && (
        <Categories text="Mi lista">
          <Caroursel>
            {mylist.map((item, key) => (
              <CarouselItem key={`${item.id}-${key}`} {...item} isList />
            ))}
          </Caroursel>
        </Categories>
      )}
      <Categories text="Tendencias">
        <Caroursel>
          {trends.map((item) => (
            <CarouselItem key={item.id} {...item} />
          ))}
        </Caroursel>
      </Categories>
      <Categories text="Originales de Platzi Video">
        <Caroursel>
          {originals.map((item) => (
            <CarouselItem key={item.id} {...item} />
          ))}
        </Caroursel>
      </Categories>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    mylist: state.mylist,
    trends: state.trends,
    originals: state.originals,
  };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Home);

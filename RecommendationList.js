import { useCart } from "react-use-cart";
import axios from "axios";
import { useState } from "react";
import {
  Row,
  Col,
  Button,
  Card,
  Container,
  Spinner,
  Modal,
} from "react-bootstrap";
import "./detail.css";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Displaydetails from "./Displaydetails";

function RecommendationList() {
  const { items, isEmpty, removeItem } = useCart();
  let navigate = useNavigate();
  let { obj } = useSelector((state) => state.users);
  let [Obj, setObj] = useState();
  let [show, setshow] = useState(false);

  const favouritebook = async (favouriteobj) => {
    if (obj != null) {
      let favourite = { name: obj.name, favourites: [{ ...favouriteobj }] };
      let response = await axios.post(
        "http://localhost:5000/user/favourite",
        favourite
      );
    } else {
      alert("Login is required");
      navigate("/login");
    }
  };

  const display = (Obj) => {
    setshow(true);

    setObj(Obj);
    console.log(Obj);
  };

  if (isEmpty) return <h2 className="mouse">No recommendations yet!</h2>;
  return (
    <div>
      <Container>
        <Row>
          {items.map((obj, index) => (
            <Col sm={12} md={6} lg={4}>
              <Card style={{ width: "18rem" }} className="mt-3 card">
                <Card.Img variant="top" src={obj.cover} height="300px" />
                <Card.Body>
                  <Card.Title className="text-center h3">
                    {obj.title}
                  </Card.Title>
                  <Card.Text>
                    <h5>Author: {obj.author}</h5>

                    <h5>Genre: {obj.genre}</h5>
                    <h6>Year: {obj.year}</h6>
                  </Card.Text>
                  <Button variant="warning" onClick={() => display(obj)}>
                    Read More
                  </Button>
                  <Button
                    variant="success"
                    className="float-end ms-auto"
                    onClick={() => favouritebook(obj)}
                  >
                    Add to Favourite
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <Modal show={show} fullscreen onHide={() => setshow(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Book Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Displaydetails Obj={Obj} />
          </Modal.Body>
        </Modal>
      </Container>
    </div>
  );
}

export default RecommendationList;

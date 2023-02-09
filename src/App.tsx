import React, { useState, useEffect } from 'react';
import './App.css';

import axios from 'axios';
import Creatable from 'react-select/creatable';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

import { IRestaurant, IPizza, IOrder, IRestaurantJSON, IPizzaJSON } from './types';
import { SingleValue } from 'react-select';
import { v4 as uuid } from 'uuid';

function App() {
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [pizzas, setPizzas] = useState<IPizza[]>([]);

  const [selectedRestaurant, setSelectedRestaurant] = useState<IRestaurant>();
  const [selectedPizza, setSelectedPizza] = useState<IPizza>();

  const [tableData, setTableData] = useState<IOrder[]>(() => {
    const saved = localStorage.getItem('dataKey');
    const initialValue: null | IOrder[] = JSON.parse(saved!);
    return initialValue || [];
  });

  const [isBtnDisabled, setIsBtnDisabled] = useState<boolean>(true);

  const urlRestaurants = 'https://private-anon-050777f7c6-pizzaapp.apiary-mock.com/restaurants/';
  const urlPizzas = `https://private-anon-050777f7c6-pizzaapp.apiary-mock.com/restaurants/${selectedRestaurant?.id}/menu?category=Pizza&orderBy=rank`;

  useEffect(() => {
    const getData = async () => {
      const arrRestaurant: IRestaurant[] = [];
      await axios.get(urlRestaurants).then((res) => {
        let result = res.data;
        result.map((restaurant: IRestaurantJSON) => {
          return arrRestaurant.push({
            value: restaurant.name.toLowerCase(),
            label: restaurant.name,
            id: restaurant.id,
          });
        });
        setRestaurants(arrRestaurant);
      });
    };
    getData();
  }, []);

  useEffect(() => {
    const arrPizzas: IPizza[] = [];
    if (!selectedRestaurant) {
      return;
    }
    axios.get(urlPizzas).then((res) => {
      let result = res.data;
      result.map((pizza: IPizzaJSON) => {
        return arrPizzas.push({
          value: pizza.name.toLowerCase(),
          label: pizza.name,
          price: pizza.price,
        });
      });
      setPizzas(arrPizzas);
    });
  }, [selectedRestaurant]);

  useEffect(() => {
    if (!tableData) {
      return;
    }
    localStorage.setItem('dataKey', JSON.stringify(tableData));
  }, [tableData]);

  const onChangeRestaurant = (event: SingleValue<IRestaurant>) => {
    setSelectedRestaurant(event || undefined);
  };

  const onChangePizza = (event: SingleValue<IPizza>) => {
    setSelectedPizza(event || undefined);
    setIsBtnDisabled(false);
  };

  const addToTable = () => {
    setTableData((data: IOrder[] | []) => [
      ...data,
      {
        restaurant: selectedRestaurant,
        product: selectedPizza,
        id: uuid(),
      } as IOrder,
    ]);
  };

  const onRemove = (item: IOrder) => {
    setTableData(tableData.filter((e) => e !== item));
  };

  return (
    <div className="App">
      <header className="App-header">
        <section>
          <h2>Create new entry</h2>

          <Creatable
            placeholder="Select an individual"
            onChange={(event: SingleValue<IRestaurant>) => onChangeRestaurant(event)}
            options={restaurants}
          />

          <Creatable
            placeholder="Select an individual"
            onChange={(event: SingleValue<IPizza>) => onChangePizza(event)}
            isDisabled={!pizzas.length}
            options={pizzas}
          />

          <Button disabled={isBtnDisabled} onClick={addToTable}>
            add to table
          </Button>
        </section>

        <span>Calculation</span>

        <section>
          <Table striped bordered hover>
            <tbody>
              <tr>
                <th>restaurant</th>
                <th>product</th>
                <th>cost</th>
                <th>actions</th>
              </tr>

              {tableData
                ? tableData.map((item: IOrder, index: number) => (
                    <tr key={item.id}>
                      <td>{item.restaurant.label}</td>
                      <td>{item.product.label}</td>
                      <td>{item.product.price}</td>
                      <td>
                        <a href="#" onClick={() => onRemove(item)}>
                          Remove
                        </a>
                      </td>
                    </tr>
                  ))
                : null}

              <tr>
                <td colSpan={2}>Summary</td>
                <td>
                  {tableData.reduce((a: number, b: IOrder) => {
                    return a + b.product.price;
                  }, 0)}
                </td>
                <td></td>
              </tr>
            </tbody>
          </Table>
        </section>
      </header>
    </div>
  );
}

export default App;

import usePizzaMenu from "../hooks/usePizzaMenu";
import PizzaCard from "../components/PizzaCard";
import Layout from "../Layout";
import { HemanthBestSellingPizza } from "@pizza-ordering-application/sdk";
import { Osdk } from "@osdk/client";

export default function PizzaMenu() {
  const { pizzas, isLoading } = usePizzaMenu();

  const grouped = (pizzas ?? []).reduce<
    Record<string, Osdk.Instance<HemanthBestSellingPizza>[]>
  >((acc, pizza) => {
    const key = pizza.name ?? "Unnamed Pizza";
    if (!acc[key]) acc[key] = [];
    acc[key].push(pizza);
    return acc;
  }, {});

  return (
    <Layout>
      <h2>🍕 Full Pizza Menu</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="menuContainer">
          {Object.entries(grouped).map(([name, variants]) => (
            <PizzaCard key={name} name={name} variants={variants} />
          ))}
        </div>
      )}
    </Layout>
  );
}

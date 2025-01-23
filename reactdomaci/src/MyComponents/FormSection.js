import React from "react";

const FormSection = ({
  newEntry,
  setNewEntry,
  handleAddEntry,
  categories,
  goals,
}) => {
  return (
    <div className="form-section">
      <h3>Dodavanje novog unosa</h3>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleAddEntry();
        }}
      >
        <label>
          Tip:
          <select
            value={newEntry.type}
            onChange={(e) =>
              setNewEntry({
                ...newEntry,
                type: e.target.value,
                source: "",
                expense_category_id: "",
              })
            }
          >
            <option value="income">Prihod</option>
            <option value="expense">Trošak</option>
          </select>
        </label>
        <label>
          Iznos:
          <input
            type="number"
            value={newEntry.amount}
            onChange={(e) =>
              setNewEntry({ ...newEntry, amount: e.target.value })
            }
            required
          />
        </label>
        <label>
          Opis:
          <input
            type="text"
            value={newEntry.description}
            onChange={(e) =>
              setNewEntry({ ...newEntry, description: e.target.value })
            }
          />
        </label>
        {newEntry.type === "income" && (
          <label>
            Izvor:
            <input
              type="text"
              value={newEntry.source}
              onChange={(e) =>
                setNewEntry({ ...newEntry, source: e.target.value })
              }
              required
            />
          </label>
        )}
        {newEntry.type === "expense" && (
          <label>
            Kategorija:
            <select
              value={newEntry.expense_category_id}
              onChange={(e) =>
                setNewEntry({
                  ...newEntry,
                  expense_category_id: e.target.value,
                })
              }
              required
            >
              <option value="">Izaberite kategoriju</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <label>
          Cilj (opciono):
          <select
            value={newEntry.goal_id || ""}
            onChange={(e) =>
              setNewEntry({
                ...newEntry,
                goal_id: e.target.value || null,
              })
            }
          >
            <option value="">Bez cilja</option>
            {goals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Datum:
          <input
            type="date"
            value={newEntry.date}
            onChange={(e) =>
              setNewEntry({ ...newEntry, date: e.target.value })
            }
            required
          />
        </label>
        <label>
          Valuta:
          <input
            type="text"
            value={newEntry.currency}
            onChange={(e) =>
              setNewEntry({ ...newEntry, currency: e.target.value })
            }
            maxLength={3}
            required
          />
        </label>
        <button type="submit">Dodaj</button>
      </form>
    </div>
  );
};

export default FormSection;

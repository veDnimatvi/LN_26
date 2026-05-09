import LazySelect from './components/LazySelect';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <h2>Lazy Load Select</h2>
      <p>Mở dropdown và cuộn xuống để tải thêm, hoặc gõ để tìm kiếm</p>

      <LazySelect
        apiUrl="https://your-api.com/don-vi"
        style={{ width: 360 }}
        placeholder="Chọn đơn vị..."
        onChange={(value, option) => console.log(value, option)}
      />
    </div>
  );
}

export default App;

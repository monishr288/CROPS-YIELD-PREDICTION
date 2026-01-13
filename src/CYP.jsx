import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import './CYP.css';

// Register Chart.js components
Chart.register(...registerables);

const CYP = () => {
  const [formData, setFormData] = useState({
    crop: 'maize',
    rainfall: 100,
    soilFertility: 0.7,
    area: 1,
    temperature: 25,
    sowingDate: new Date().toISOString().split('T')[0]
  });

  const [prediction, setPrediction] = useState({
    crop: 'maize',
    yieldPerHa: '0.90',
    totalYield: '0.90'
  });

  const [pastPredictions, setPastPredictions] = useState([
    'maize - 0.90 tons/ha',
    'rice - 1.20 tons/ha',
    'rice - 1.15 tons/ha',
    'rice - 1.25 tons/ha',
    'rice - 1.10 tons/ha'
  ]);

  const [isLoaded, setIsLoaded] = useState(false);
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // Trigger opening animation
    setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    generateGrassBlades();
    generateFloatingLeaves();
    
    // Initialize chart after a small delay to ensure DOM is ready
    setTimeout(() => {
      initializeChart();
    }, 100);
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  const generateGrassBlades = () => {
    const grassBladesContainer = document.getElementById('grassBlades');
    if (grassBladesContainer) {
      grassBladesContainer.innerHTML = '';
      for (let i = 0; i < 100; i++) {
        const blade = document.createElement('div');
        blade.className = 'grass-blade';
        blade.style.left = `${Math.random() * 100}%`;
        blade.style.animationDelay = `${Math.random() * 3}s`;
        blade.style.height = `${70 + Math.random() * 50}px`;
        grassBladesContainer.appendChild(blade);
      }
    }
  };

  const generateFloatingLeaves = () => {
    const leavesContainer = document.getElementById('floatingLeaves');
    if (leavesContainer) {
      leavesContainer.innerHTML = '';
      for (let i = 0; i < 15; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        leaf.style.left = `${Math.random() * 100}%`;
        leaf.style.animationDelay = `${Math.random() * 15}s`;
        leaf.style.width = `${10 + Math.random() * 20}px`;
        leaf.style.height = leaf.style.width;
        leavesContainer.appendChild(leaf);
      }
    }
  };

  const initializeChart = () => {
    if (chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');
      
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [
            {
              label: 'Predicted Yield (tons/ha)',
              data: [0.8, 0.9, 1.1, 1.3, 1.5, 1.6, 1.7, 1.6, 1.4, 1.2, 1.0, 0.9],
              borderColor: '#4CAF50',
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
            },
            {
              label: 'Historical Average (tons/ha)',
              data: [0.7, 0.8, 1.0, 1.2, 1.4, 1.5, 1.6, 1.5, 1.3, 1.1, 0.9, 0.8],
              borderColor: '#FF9800',
              backgroundColor: 'rgba(255, 152, 0, 0.1)',
              borderWidth: 2,
              borderDash: [5, 5],
              fill: true,
              tension: 0.4,
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                color: '#e0e0e0',
                font: {
                  size: 12,
                  weight: 'bold'
                },
                usePointStyle: true,
                padding: 15,
                boxWidth: 12
              }
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              titleColor: '#4CAF50',
              bodyColor: '#e0e0e0',
              borderColor: '#4CAF50',
              borderWidth: 1,
              padding: 12,
              cornerRadius: 6,
              displayColors: true
            }
          },
          scales: {
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)',
                drawBorder: true,
                borderColor: 'rgba(255, 255, 255, 0.2)'
              },
              ticks: {
                color: '#e0e0e0',
                font: {
                  size: 11,
                  weight: 'bold'
                },
                padding: 5
              },
              title: {
                display: true,
                text: 'Months',
                color: '#e0e0e0',
                font: {
                  size: 12,
                  weight: 'bold'
                },
                padding: {
                  top: 10
                }
              }
            },
            y: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)',
                drawBorder: true,
                borderColor: 'rgba(255, 255, 255, 0.2)'
              },
              ticks: {
                color: '#e0e0e0',
                font: {
                  size: 11
                },
                callback: function(value) {
                  return value + ' tons';
                },
                stepSize: 0.5,
                padding: 8
              },
              beginAtZero: true,
              max: 2,
              title: {
                display: true,
                text: 'Yield (tons/ha)',
                color: '#e0e0e0',
                font: {
                  size: 12,
                  weight: 'bold'
                },
                padding: {
                  bottom: 10
                }
              }
            }
          },
          elements: {
            point: {
              radius: 5,
              hoverRadius: 8,
              backgroundColor: '#ffffff',
              borderWidth: 2
            },
            line: {
              tension: 0.4
            }
          },
          layout: {
            padding: {
              left: 5,
              right: 5,
              top: 5,
              bottom: 5
            }
          }
        }
      });
    }
  };

  const updateChart = (crop, yieldPerHa) => {
    if (chartInstance.current) {
      const basePatterns = {
        maize: [0.6, 0.7, 0.9, 1.2, 1.5, 1.7, 1.8, 1.7, 1.4, 1.1, 0.8, 0.7],
        rice: [0.7, 0.8, 1.0, 1.3, 1.6, 1.8, 2.0, 1.9, 1.6, 1.2, 0.9, 0.8],
        wheat: [0.8, 0.9, 1.1, 1.0, 0.9, 0.8, 0.7, 0.8, 1.0, 1.2, 1.1, 0.9],
        soybean: [0.5, 0.6, 0.8, 1.0, 1.3, 1.5, 1.6, 1.5, 1.2, 0.9, 0.7, 0.6]
      };

      const basePattern = basePatterns[crop] || basePatterns.maize;
      const targetYield = parseFloat(yieldPerHa);
      const currentPeak = Math.max(...basePattern);
      const scaleFactor = targetYield / currentPeak;
      
      const newData = basePattern.map(value => 
        Math.max(0.1, parseFloat((value * scaleFactor).toFixed(2)))
      );

      chartInstance.current.data.datasets[0].data = newData;
      chartInstance.current.update();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateYield = () => {
    const { crop, rainfall, soilFertility, area, temperature } = formData;
    
    let baseYield;
    switch(crop) {
      case 'maize': baseYield = 1.2; break;
      case 'rice': baseYield = 1.5; break;
      case 'wheat': baseYield = 1.0; break;
      case 'soybean': baseYield = 0.8; break;
      case 'sugarcane': baseYield = 8.0; break;
      case 'millet': baseYield = 0.9; break;
      case 'barley': baseYield = 1.1; break;
      case 'gram': baseYield = 0.7; break;
      case 'groundnut': baseYield = 1.0; break;
      default: baseYield = 1.0;
    }

    const rainfallFactor = Math.min(rainfall / 150, 1.5);
    const tempFactor = 1 - Math.abs(temperature - 25) / 50;
    const fertilityFactor = parseFloat(soilFertility);
    
    const yieldPerHa = (baseYield * rainfallFactor * tempFactor * fertilityFactor).toFixed(2);
    const totalYield = (yieldPerHa * area).toFixed(2);

    const newPrediction = {
      crop,
      yieldPerHa,
      totalYield
    };

    setPrediction(newPrediction);
    updateChart(crop, yieldPerHa);

    // Add to past predictions
    const newPastPrediction = `${crop} - ${yieldPerHa} tons/ha`;
    setPastPredictions(prev => [newPastPrediction, ...prev.slice(0, 4)]);
  };

  return (
    <div className={`cyp-container ${isLoaded ? 'loaded' : ''}`}>
      {/* Opening Screen Animation */}
      <div className="opening-screen">
        <div className="opening-content">
          <div className="opening-icon">🌾</div>
          <h1 className="opening-title">
            <span className="title-part">CYP</span>
            <span className="title-part">Crop Yield</span>
            <span className="title-part">Predictor</span>
          </h1>
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
          <p className="opening-subtitle">Harvesting Data for Better Agriculture</p>
        </div>
      </div>

      {/* Advanced Grass Background */}
      <div className="grass-background">
        <div className="grass-layer-1"></div>
        <div className="grass-layer-2"></div>
        <div className="grass-layer-3"></div>
        <div className="grass-blades" id="grassBlades"></div>
      </div>
      
      {/* Floating leaves for additional atmosphere */}
      <div className="floating-leaves" id="floatingLeaves"></div>

      {/* Main Content Container */}
      <div className="container">
        <header className="main-header">
          <div className="header-content">
            <div className="logo">
              <span className="logo-icon">🌾</span>
              <h1>CYP</h1>
              <span className="logo-subtitle">Crop Yield Predictor</span>
            </div>
            <div className="header-tagline">
              Smart Agriculture • Data-Driven Decisions • Sustainable Farming
            </div>
          </div>
        </header>
        
        <div className="app-layout-full">
          <div className="input-results-panel">
            <div className="form-section">
              <div className="section-header">
                <h2>🌱 Input Parameters</h2>
                <div className="section-indicator"></div>
              </div>
              
              <div className="input-group">
                <label htmlFor="crop">
                  <span className="input-icon">🌽</span>
                  Crop Type:
                </label>
                <select 
                  id="crop" 
                  name="crop" 
                  value={formData.crop} 
                  onChange={handleInputChange}
                  className="input-animate"
                >
                  <option value="maize">Maize 🌽</option>
                  <option value="rice">Rice 🌾</option>
                  <option value="wheat">Wheat 🌾</option>
                  <option value="soybean">Soybean 🫘</option>
                  <option value="sugarcane">Sugarcane 🎋</option>
                  <option value="millet">Millet 🌾</option>
                  <option value="barley">Barley 🌾</option>
                  <option value="gram">Gram 🫘</option>
                  <option value="groundnut">Groundnut 🥜</option>
                </select>
              </div>
              
              <div className="input-group">
                <label htmlFor="rainfall">
                  <span className="input-icon">💧</span>
                  Rainfall: <span className="value-display">{formData.rainfall}mm</span>
                </label>
                <input 
                  type="range" 
                  id="rainfall" 
                  name="rainfall" 
                  min="50" 
                  max="500" 
                  value={formData.rainfall} 
                  onChange={handleInputChange}
                  className="slider-animate"
                />
                <div className="slider-labels">
                  <span>50mm</span>
                  <span>275mm</span>
                  <span>500mm</span>
                </div>
              </div>
              
              <div className="input-group">
                <label htmlFor="soil-fertility">
                  <span className="input-icon">🌱</span>
                  Soil Fertility: <span className="value-display">{formData.soilFertility}</span>
                </label>
                <input 
                  type="range" 
                  id="soil-fertility" 
                  name="soilFertility" 
                  min="0.1" 
                  max="1" 
                  step="0.05" 
                  value={formData.soilFertility} 
                  onChange={handleInputChange}
                  className="slider-animate"
                />
                <div className="slider-labels">
                  <span>Poor</span>
                  <span>Medium</span>
                  <span>Rich</span>
                </div>
              </div>
              
              <div className="input-group">
                <label htmlFor="area">
                  <span className="input-icon">📏</span>
                  Area (hectares):
                </label>
                <input 
                  type="number" 
                  id="area" 
                  name="area" 
                  min="0.1" 
                  step="0.1" 
                  value={formData.area} 
                  onChange={handleInputChange}
                  className="input-animate"
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="temperature">
                  <span className="input-icon">🌡️</span>
                  Temperature: <span className="value-display">{formData.temperature}°C</span>
                </label>
                <input 
                  type="range" 
                  id="temperature" 
                  name="temperature" 
                  min="10" 
                  max="40" 
                  value={formData.temperature} 
                  onChange={handleInputChange}
                  className="slider-animate"
                />
                <div className="slider-labels">
                  <span>10°C</span>
                  <span>25°C</span>
                  <span>40°C</span>
                </div>
              </div>
              
              <div className="input-group">
                <label htmlFor="sowing-date">
                  <span className="input-icon">📅</span>
                  Sowing Date:
                </label>
                <input 
                  type="date" 
                  id="sowing-date" 
                  name="sowingDate" 
                  value={formData.sowingDate} 
                  onChange={handleInputChange}
                  className="input-animate"
                />
              </div>
              
              <button className="predict-btn" onClick={calculateYield}>
                <span className="btn-icon">🔮</span>
                Predict Yield
                <span className="btn-arrow">→</span>
              </button>
            </div>
            
            <div className="results-sidebar">
              <div className="result-section">
                <div className="section-header">
                  <h2>📊 Prediction Result</h2>
                  <div className="section-indicator"></div>
                </div>
                <div className="result">
                  <div className="result-header">
                    <div className="result-icon">🌾</div>
                    <div className="result-title">Yield Analysis</div>
                  </div>
                  <div className="result-grid">
                    <div className="result-item animate-item">
                      <span className="result-label">Crop Type:</span>
                      <span className="result-value">{prediction.crop}</span>
                    </div>
                    <div className="result-item animate-item">
                      <span className="result-label">Yield per hectare:</span>
                      <span className="result-value highlight">{prediction.yieldPerHa} tons/ha</span>
                    </div>
                    <div className="result-item animate-item">
                      <span className="result-label">Total Yield:</span>
                      <span className="result-value highlight">{prediction.totalYield} tons</span>
                    </div>
                  </div>
                  <div className="result-footer">
                    <span className="result-tag">Optimal</span>
                    <span className="result-status">✓ Ready for Harvest</span>
                  </div>
                </div>
              </div>
              
              <div className="past-predictions-section">
                <div className="section-header">
                  <h2>📜 Recent Predictions</h2>
                  <div className="section-indicator"></div>
                </div>
                <div className="predictions-container">
                  <ul className="past-predictions">
                    {pastPredictions.map((pred, index) => (
                      <li key={index} className="prediction-item">
                        <span className="prediction-icon">📈</span>
                        <span className="prediction-text">{pred}</span>
                        <span className="prediction-time">Just now</span>
                      </li>
                    ))}
                  </ul>
                  <div className="predictions-footer">
                    <span className="total-count">Total: {pastPredictions.length} predictions</span>
                    <button className="clear-btn" onClick={() => setPastPredictions([])}>
                      Clear All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full Width Graph Section */}
          <div className="chart-section-fullwidth">
            <div className="section-header">
              <h2>📈 Yield Analysis Chart</h2>
              <div className="chart-controls">
                <button className="chart-btn active">Monthly</button>
                <button className="chart-btn">Seasonal</button>
                <button className="chart-btn">Annual</button>
              </div>
            </div>
            <div className="chart-container-fullwidth">
              <canvas ref={chartRef}></canvas>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color" style={{backgroundColor: '#4CAF50'}}></div>
                <span>Predicted Yield</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{backgroundColor: '#FF9800'}}></div>
                <span>Historical Average</span>
              </div>
            </div>
          </div>
          
          {/* Footer Section */}
          <footer className="footer-section">
            <div className="footer-content">
              <div className="footer-logo">
                <div className="footer-icon-animate">
                  <span className="footer-icon">🌾</span>
                </div>
                <h3>CYP - Crop Yield Predictor</h3>
                <p className="footer-tagline">Transforming Agriculture with AI-Powered Insights</p>
              </div>
              
              <div className="footer-features">
                <div className="feature">
                  <span className="feature-icon">⚡</span>
                  <span className="feature-text">Real-time Predictions</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">📊</span>
                  <span className="feature-text">Data Analytics</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🌍</span>
                  <span className="feature-text">Global Standards</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🤖</span>
                  <span className="feature-text">AI-Powered</span>
                </div>
              </div>
              
              <div className="footer-copyright">
                <p>© {new Date().getFullYear()} CYP - Crop Yield Predictor. All rights reserved.</p>
                <div className="developer-credit">
                  <span className="heart">❤️</span>
                  <span className="developer-text">Crafted with passion by Monish</span>
                  <span className="heart">❤️</span>
                </div>
              </div>
              
              <div className="footer-disclaimer">
                <div className="disclaimer-icon">⚠️</div>
                <p>Disclaimer: Predictive analytics are for guidance purposes. Actual yields may vary based on real-world conditions.</p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default CYP;
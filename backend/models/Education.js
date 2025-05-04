module.exports = (sequelize, DataTypes) => {
    const Education = sequelize.define('Education', {
      degree: {
        type: DataTypes.STRING,
        allowNull: false
      },
      field: DataTypes.STRING,
      institution: {
        type: DataTypes.STRING,
        allowNull: false
      },
      location: DataTypes.STRING,
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'start_date'
      },
      endDate: {
        type: DataTypes.DATE,
        field: 'end_date'
      },
      current: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      description: DataTypes.TEXT,
      userId: {
        type: DataTypes.INTEGER,
        field: 'user_id',
        allowNull: false
      }
    }, {
      tableName: 'educations',
      timestamps: true,
      underscored: true
    });
  
    Education.associate = (models) => {
      Education.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    };
  
    return Education;
  };
!(function () {
    var Section = function (height, width, x, y) {
        this.height = height;
        this.width = width;
        this.x = x;
        this.y = y;

        this._indexMap = {};
        this._indices = [];
    };

    Section.prototype = {
        constructor: Section,
        addCellIndex: function (index) {
            if (!this._indexMap[index]) {
                this._indexMap[index] = true;
                this._indices.push(index);
            }
        },

        getCellIndices: function () {
            return this._indices
        }
    };

    var SECTION_SIZE = 100;
    BI.SectionManager = function (sectionSize) {
        this._sectionSize = sectionSize || SECTION_SIZE;
        this._cellMetadata = [];
        this._sections = {};
    };

    BI.SectionManager.prototype = {
        constructor: BI.SectionManager,
        getCellIndices: function (height, width, x, y) {
            var indices = {};

            BI.each(this.getSections(height, width, x, y), function (i, section) {
                BI.each(section.getCellIndices(), function (j, index) {
                    indices[index] = index
                })
            });

            return BI.map(BI.keys(indices), function (i, index) {
                return indices[index]
            });
        },

        getCellMetadata: function (index) {
            return this._cellMetadata[index];
        },

        getSections: function (height, width, x, y) {
            var sectionXStart = Math.floor(x / this._sectionSize);
            var sectionXStop = Math.floor((x + width - 1) / this._sectionSize);
            var sectionYStart = Math.floor(y / this._sectionSize);
            var sectionYStop = Math.floor((y + height - 1) / this._sectionSize);

            var sections = [];

            for (var sectionX = sectionXStart; sectionX <= sectionXStop; sectionX++) {
                for (var sectionY = sectionYStart; sectionY <= sectionYStop; sectionY++) {
                    var key = sectionX + "." + sectionY;

                    if (!this._sections[key]) {
                        this._sections[key] = new Section(this._sectionSize, this._sectionSize, sectionX * this._sectionSize, sectionY * this._sectionSize)
                    }

                    sections.push(this._sections[key])
                }
            }

            return sections
        },

        getTotalSectionCount: function () {
            return BI.size(this._sections);
        },

        registerCell: function (cellMetadatum, index) {
            this._cellMetadata[index] = cellMetadatum;

            BI.each(this.getSections(cellMetadatum.height, cellMetadatum.width, cellMetadatum.x, cellMetadatum.y), function (i, section) {
                section.addCellIndex(index);
            });
        }
    }
})();
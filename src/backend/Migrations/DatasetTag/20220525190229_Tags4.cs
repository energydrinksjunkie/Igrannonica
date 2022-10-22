using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations.DatasetTag
{
    public partial class Tags4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DatasetDatasetTag");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DatasetDatasetTag",
                columns: table => new
                {
                    DatasetsId = table.Column<int>(type: "integer", nullable: false),
                    TagsId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DatasetDatasetTag", x => new { x.DatasetsId, x.TagsId });
                    table.ForeignKey(
                        name: "FK_DatasetDatasetTag_Datasets_DatasetsId",
                        column: x => x.DatasetsId,
                        principalTable: "Datasets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DatasetDatasetTag_Tags_TagsId",
                        column: x => x.TagsId,
                        principalTable: "Tags",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DatasetDatasetTag_TagsId",
                table: "DatasetDatasetTag",
                column: "TagsId");
        }
    }
}

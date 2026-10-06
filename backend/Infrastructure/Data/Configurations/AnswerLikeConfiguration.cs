using Backend.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Backend.Infrastructure.Data.Configurations;

public class AnswerLikeConfiguration : IEntityTypeConfiguration<AnswerLike>
{
    public void Configure(EntityTypeBuilder<AnswerLike> builder)
    {
        builder.HasKey(al => new { al.UserId, al.AnswerId });

        builder.Property(al => al.CreatedAt).IsRequired();

        builder.HasOne(al => al.User)
            .WithMany(u => u.AnswerLikes)
            .HasForeignKey(al => al.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(al => al.Answer)
            .WithMany(a => a.Likes)
            .HasForeignKey(al => al.AnswerId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}